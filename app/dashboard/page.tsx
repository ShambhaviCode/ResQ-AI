'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BellRing, Compass, MapPin, Users2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapboxMap } from '@/components/ui/mapbox-map';
import { useToast } from '@/components/ui/toaster';
import { createSampleIncidents, getStoredUser, loadIncidentsFromBackend, type IncidentRecord, type UserRole } from '@/lib/resq-store';

const roleCopy: Record<UserRole, { heading: string; description: string }> = {
  Citizen: {
    heading: 'Citizen response hub',
    description: 'Report incidents, track updates, and stay informed while your mission moves forward.',
  },
  Volunteer: {
    heading: 'Mission-ready operations',
    description: 'Discover nearby incidents, accept missions, and keep the response network coordinated.',
  },
  Admin: {
    heading: 'Command center overview',
    description: 'Coordinate volunteers, review AI triage, and monitor the full response surface.',
  },
};

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const { pushToast } = useToast();

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);

    void (async () => {
      const loaded = await loadIncidentsFromBackend();
      setIncidents(loaded.length > 0 ? loaded : createSampleIncidents());
    })();
  }, []);

  const metrics = useMemo(() => {
    const openIncidents = incidents.filter((incident) => incident.status !== 'Resolved').length;
    const volunteerCoverage = incidents.length > 0 ? `${Math.max(80, 90 - incidents.length)}%` : '92%';
    return [
      { label: 'Open incidents', value: String(openIncidents), tone: 'text-white' },
      { label: 'Avg. response', value: '6m', tone: 'text-brand-200' },
      { label: 'Volunteer uptime', value: volunteerCoverage, tone: 'text-rescue' },
    ];
  }, [incidents]);

  const role = user?.role ?? 'Volunteer';

  const acceptMission = (incidentId: string) => {
    setIncidents((current) => current.map((incident) => (incident.id === incidentId ? { ...incident, status: 'Accepted' } : incident)));
    pushToast('Mission accepted and routed to your queue.', 'success');
  };

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">ResQ AI</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{roleCopy[role].heading}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">{roleCopy[role].description}</p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-800/70 px-4 py-2 text-sm text-slate-300">
              <BellRing className="h-4 w-4 text-brand-200" />
              {incidents.length} live incidents available
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Nearby incidents</CardDescription>
                  <CardTitle>Live mission feed</CardTitle>
                </div>
                <div className="rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-200">Auto-updating</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-crisis" />
                        <p className="font-medium text-white">{incident.title}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{incident.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-400">
                        <span className="rounded-full bg-slate-700/70 px-2.5 py-1">{incident.severity}</span>
                        <span className="rounded-full bg-slate-700/70 px-2.5 py-1">{incident.location}</span>
                        <span className="rounded-full bg-slate-700/70 px-2.5 py-1">{incident.status}</span>
                      </div>
                    </div>
                    <Button onClick={() => acceptMission(incident.id)} size="sm">
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-200">
                  <Compass className="h-5 w-5" />
                  <CardTitle>Mission map</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-[24px] border border-dashed border-white/10 bg-gradient-to-br from-brand-500/10 to-slate-800 p-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4" />
                    Downtown district • 3 hotspots within 2 km
                  </div>
                  <div className="mt-4">
                    <MapboxMap className="h-40" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-200">
                  <Users2 className="h-5 w-5" />
                  <CardTitle>Operational metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3">
                    <span className="text-sm text-slate-400">{metric.label}</span>
                    <span className={`font-semibold ${metric.tone}`}>{metric.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/incident" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            Open incident details
          </Link>
          <Link href="/admin" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600">
            Go to command center
          </Link>
        </div>
      </div>
    </main>
  );
}
