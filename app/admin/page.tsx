'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Landmark, Radar, ShieldCheck, Users2, Clock3, Sparkles } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSampleIncidents, loadIncidentsFromBackend, type IncidentRecord } from '@/lib/resq-store';

const stats = [
  { label: 'Live incidents', value: '12', icon: AlertTriangle },
  { label: 'Volunteers online', value: '48', icon: Users2 },
  { label: 'Avg. triage', value: '42s', icon: Radar },
  { label: 'Response coverage', value: '94%', icon: ShieldCheck },
];

export default function AdminPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  useEffect(() => {
    void (async () => {
      const loaded = await loadIncidentsFromBackend();
      setIncidents(loaded.length > 0 ? loaded : createSampleIncidents());
    })();
  }, []);

  const activeCount = useMemo(() => incidents.filter((incident) => incident.status !== 'Resolved').length, [incidents]);

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">Command center</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Live operations command surface</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">A premium control room for coordinating volunteers, resources, and incident intelligence in real time.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader>
                  <div className="flex items-center gap-2 text-brand-200">
                    <Icon className="h-5 w-5" />
                    <CardDescription>{stat.label}</CardDescription>
                  </div>
                  <CardTitle className="mt-2 text-3xl">{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Incident feed</CardDescription>
                  <CardTitle>Priority queue</CardTitle>
                </div>
                <div className="rounded-full border border-rescue/30 bg-rescue/15 px-3 py-1 text-sm text-rescue">{activeCount} active</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3">
                  <div className="flex items-center gap-2 text-white">
                    <Activity className="h-4 w-4 text-brand-200" />
                    {incident.title}
                  </div>
                  <span className="text-sm text-slate-400">{incident.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <Landmark className="h-5 w-5" />
                <CardTitle>AI analysis panel</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents.slice(0, 3).map((incident) => (
                <div key={incident.id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-brand-200">
                    <Sparkles className="h-4 w-4" />
                    <span>{incident.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{incident.analysis.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="rounded-full bg-slate-700/70 px-2.5 py-1">Severity: {incident.analysis.severity}</span>
                    <span className="rounded-full bg-slate-700/70 px-2.5 py-1">Priority: {incident.analysis.priorityScore}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <Clock3 className="h-5 w-5" />
                <CardTitle>Incident timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-400">
              <p>09:30 • Mission accepted</p>
              <p>10:05 • AI triage generated</p>
              <p>10:20 • Volunteer routed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <Users2 className="h-5 w-5" />
                <CardTitle>Volunteer status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-400">
              <p>12 responders online</p>
              <p>3 missions assigned</p>
              <p>92% availability</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <ShieldCheck className="h-5 w-5" />
                <CardTitle>Resource summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-400">
              <p>2 ambulances queued</p>
              <p>1 drone team ready</p>
              <p>6 volunteers dispatching</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
