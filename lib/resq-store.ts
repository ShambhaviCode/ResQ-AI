import { createSupabaseClient, signInWithEmail, signUpWithEmail, uploadIncidentImage } from './supabase';

export type UserRole = 'Citizen' | 'Volunteer' | 'Admin';

export type IncidentStatus = 'Reported' | 'Accepted' | 'In Progress' | 'Resolved';

export type AiAnalysis = {
  summary: string;
  severity: string;
  priorityScore: number;
  resources: string[];
  safetyRecommendations: string[];
};

export type IncidentRecord = {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: string;
  imageUrl?: string;
  status: IncidentStatus;
  createdAt: string;
  volunteer?: string;
  analysis: AiAnalysis;
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

const USER_STORAGE_KEY = 'resq-ai-user';
const INCIDENTS_STORAGE_KEY = 'resq-ai-incidents';
const USER_COOKIE_KEY = 'resq-ai-user';

function setCookieValue(name: string, value: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}

function removeCookieValue(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function readStoredUserFromStorage() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const cached = readStoredUserFromStorage();
  if (cached) return cached;

  const raw = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${USER_COOKIE_KEY}=`))
    ?.split('=')[1];
  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw)) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser) {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(user);
  window.localStorage.setItem(USER_STORAGE_KEY, serialized);
  setCookieValue(USER_COOKIE_KEY, serialized);
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(USER_STORAGE_KEY);
  removeCookieValue(USER_COOKIE_KEY);
}

export function getStoredIncidents() {
  if (typeof window === 'undefined') return [] as IncidentRecord[];
  const raw = window.localStorage.getItem(INCIDENTS_STORAGE_KEY);
  if (!raw) return [] as IncidentRecord[];

  try {
    return JSON.parse(raw) as IncidentRecord[];
  } catch {
    return [] as IncidentRecord[];
  }
}

export function saveStoredIncidents(incidents: IncidentRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
}

function toIncidentRecord(row: Record<string, unknown>): IncidentRecord {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    location: String(row.location ?? ''),
    severity: String(row.severity ?? 'High'),
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    status: String(row.status ?? 'Reported') as IncidentStatus,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    volunteer: row.volunteer ? String(row.volunteer) : undefined,
    analysis: {
      summary: String(row.ai_summary ?? 'AI summary pending.'),
      severity: String(row.severity ?? 'High'),
      priorityScore: Number(row.ai_priority ?? 72),
      resources: Array.isArray(row.ai_resources) ? row.ai_resources.map((item) => String(item)) : ['Medical unit', 'Volunteer team'],
      safetyRecommendations: ['Secure the perimeter', 'Maintain clear evacuation routes'],
    },
  };
}

function toIncidentRow(incident: IncidentRecord) {
  return {
    id: incident.id,
    title: incident.title,
    description: incident.description,
    location: incident.location,
    severity: incident.severity,
    status: incident.status,
    created_at: incident.createdAt,
    ai_summary: incident.analysis.summary,
    ai_priority: incident.analysis.priorityScore,
    ai_resources: incident.analysis.resources,
  };
}

export async function loadIncidentsFromBackend() {
  const client = createSupabaseClient();
  const fallback = getStoredIncidents();
  if (!client) {
    if (fallback.length === 0) {
      const sample = createSampleIncidents();
      saveStoredIncidents(sample);
      return sample;
    }
    return fallback;
  }

  const { data, error } = await client.from('incidents').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    if (fallback.length === 0) {
      const sample = createSampleIncidents();
      saveStoredIncidents(sample);
      return sample;
    }
    return fallback;
  }

  const mapped = data.map((row) => toIncidentRecord(row as Record<string, unknown>));
  saveStoredIncidents(mapped);
  return mapped;
}

export async function saveIncidentsToBackend(incidents: IncidentRecord[]) {
  saveStoredIncidents(incidents);
  const client = createSupabaseClient();
  if (!client) return incidents;

  const rows = incidents.map((incident) => toIncidentRow(incident));
  const { error } = await client.from('incidents').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error(error);
    return incidents;
  }

  return incidents;
}

export async function persistIncidentToBackend(incident: IncidentRecord) {
  const incidents = getStoredIncidents();
  const next = [incident, ...incidents.filter((item) => item.id !== incident.id)];
  const saved = await saveIncidentsToBackend(next);

  const client = createSupabaseClient();
  if (client && incident.imageUrl) {
    const { error } = await client.from('incident_media').upsert({
      id: crypto.randomUUID(),
      incident_id: incident.id,
      url: incident.imageUrl,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
    }
  }

  return saved;
}

export async function persistUserToBackend(user: StoredUser) {
  const client = createSupabaseClient();
  if (client) {
    await signUpWithEmail({ email: user.email, password: user.password, options: { data: { name: user.name, role: user.role } } });
    await signInWithEmail(user.email, user.password);
    const { error } = await client.from('users').upsert({ id: user.id, name: user.name, email: user.email, role: user.role });
    if (error) {
      console.error(error);
    }
  }

  setStoredUser(user);
  return user;
}

export async function persistIncidentImage(incidentId: string, file: File | null) {
  if (!file) {
    return null;
  }

  return uploadIncidentImage(file, incidentId);
}

export function createSampleIncidents(): IncidentRecord[] {
  return [
    {
      id: 'inc-001',
      title: 'Downtown shelter breach',
      description: 'Shelter entrance is congested and medical supplies need immediate redistribution.',
      location: 'Harbor District',
      severity: 'High',
      status: 'In Progress',
      createdAt: '2026-08-03T10:05:00.000Z',
      volunteer: 'Mina Alvarez',
      analysis: {
        summary: 'High-volume shelter congestion requires additional support and route management.',
        severity: 'High',
        priorityScore: 87,
        resources: ['Medical team', 'Shelter support unit', '2 volunteers'],
        safetyRecommendations: ['Keep access lanes clear', 'Monitor for heat stress'],
      },
    },
    {
      id: 'inc-002',
      title: 'Riverfront blockage',
      description: 'A fallen utility pole has blocked access for ambulatory evacuees.',
      location: 'Riverfront',
      severity: 'Critical',
      status: 'Accepted',
      createdAt: '2026-08-03T09:30:00.000Z',
      volunteer: 'Jules Carter',
      analysis: {
        summary: 'Critical access obstruction with immediate evacuation risk.',
        severity: 'Critical',
        priorityScore: 94,
        resources: ['Fire crew', 'Utility team', 'Rapid response vehicle'],
        safetyRecommendations: ['Secure the perimeter', 'Use alternate evacuation routes'],
      },
    },
  ];
}

export function seedIncidentsIfNeeded() {
  if (typeof window === 'undefined') return;
  const existing = getStoredIncidents();
  if (existing.length === 0) {
    saveStoredIncidents(createSampleIncidents());
  }
}
