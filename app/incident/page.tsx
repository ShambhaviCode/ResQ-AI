'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, BrainCircuit, ShieldAlert, TimerReset, Waves } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSampleIncidents, getStoredIncidents, type IncidentRecord } from '@/lib/resq-store';

const cards = [
  { title: 'Incident summary', value: 'summary', icon: BrainCircuit },
  { title: 'Severity classification', value: 'severity', icon: ShieldAlert },
  { title: 'Priority score', value: 'priority', icon: TimerReset },
  { title: 'Suggested resources', value: 'resources', icon: Activity },
];

export default function IncidentPage() {
  const [incident, setIncident] = useState<IncidentRecord | null>(null);

  useEffect(() => {
    const incidents = getStoredIncidents();
    setIncident(incidents[0] ?? createSampleIncidents()[0]);
  }, []);

  const analysis = useMemo(() => incident?.analysis, [incident]);

  if (!incident || !analysis) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">Incident details</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{incident.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">{incident.description} • {incident.location}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <BrainCircuit className="h-5 w-5" />
                <CardTitle>Incident summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-400">{analysis.summary}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <ShieldAlert className="h-5 w-5" />
                <CardTitle>Severity classification</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-400">{analysis.severity}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <TimerReset className="h-5 w-5" />
                <CardTitle>Priority score</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-400">{analysis.priorityScore} / 100</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <Activity className="h-5 w-5" />
                <CardTitle>Suggested resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-400">{analysis.resources.join(', ')}</CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-200">
              <Waves className="h-5 w-5" />
              <CardTitle>Safety recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-7 text-slate-400">
            {analysis.safetyRecommendations.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
