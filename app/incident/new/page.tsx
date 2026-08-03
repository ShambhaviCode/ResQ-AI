'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Camera, MapPin, Sparkles, Waves } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toaster';
import { persistIncidentImage, persistIncidentToBackend, type IncidentRecord } from '@/lib/resq-store';
import { createAiAnalysisPayload } from '@/lib/ai';

const severityOptions = ['Low', 'Medium', 'High', 'Critical'];

export default function NewIncidentPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('High');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(() => (imageUrl ? imageUrl : 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'), [imageUrl]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, severity, description }),
      });

      const analysis = response.ok
        ? await response.json()
        : createAiAnalysisPayload({ title, location, severity, description });

      const incidentId = `inc-${crypto.randomUUID().slice(0, 6)}`;
      const uploadedImageUrl = selectedFile ? await persistIncidentImage(incidentId, selectedFile) : null;

      const incident: IncidentRecord = {
        id: incidentId,
        title,
        description,
        location,
        severity,
        imageUrl: uploadedImageUrl ?? (imageUrl || preview),
        status: 'Reported',
        createdAt: new Date().toISOString(),
        analysis: {
          summary: analysis.summary ?? createAiAnalysisPayload({ title, location, severity, description }).summary,
          severity: analysis.severity ?? severity,
          priorityScore: Number(analysis.priorityScore ?? 72),
          resources: Array.isArray(analysis.resources) ? analysis.resources : createAiAnalysisPayload({ title, location, severity, description }).resources,
          safetyRecommendations: Array.isArray(analysis.safetyRecommendations) ? analysis.safetyRecommendations : createAiAnalysisPayload({ title, location, severity, description }).safetyRecommendations,
        },
      };

      await persistIncidentToBackend(incident);
      pushToast('Incident reported. AI analysis will be visible in the command center.', 'success');
      router.push('/dashboard');
    } catch {
      pushToast('The report was saved locally, but the AI analysis was unavailable.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">Incident reporting</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Capture the situation in seconds</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">Upload context, share location, and let the system generate AI-backed triage instantly.</p>
            </div>
            <Link href="/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
              Return to workspace
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <Camera className="h-5 w-5" />
                <CardTitle>Evidence capture</CardTitle>
              </div>
              <CardDescription>Use imagery and precise location context to speed up rescues.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Image src={preview} alt="Incident preview" width={800} height={500} className="h-64 w-full rounded-[24px] object-cover" />
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-slate-800/70 px-4 py-3 text-sm text-slate-300">
                <Camera className="h-4 w-4" />
                Upload incident image
                <input type="file" className="hidden" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const nextUrl = URL.createObjectURL(file);
                    setSelectedFile(file);
                    setImageUrl(nextUrl);
                  }
                }} />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-200">
                <Sparkles className="h-5 w-5" />
                <CardTitle>Response details</CardTitle>
              </div>
              <CardDescription>Submit the report and let the AI triage engine prepare recommended actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="title">Incident title</label>
                  <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="Warehouse fire" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="description">Description</label>
                  <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="Describe what responders need to know" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="location">Location</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white">
                    <MapPin className="h-4 w-4 text-brand-200" />
                    <input id="location" value={location} onChange={(event) => setLocation(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Harbor District" required />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="severity">Severity</label>
                  <select id="severity" value={severity} onChange={(event) => setSeverity(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0">
                    {severityOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-[24px] border border-brand-500/20 bg-brand-500/10 p-4 text-sm text-brand-100">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    AI will generate summary, severity, resources, and safety guidance.
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting…' : 'Report incident'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
