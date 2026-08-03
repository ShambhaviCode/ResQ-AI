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

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(USER_STORAGE_KEY);
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
