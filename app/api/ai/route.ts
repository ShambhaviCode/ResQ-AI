import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, location, severity } = body as { title?: string; location?: string; severity?: string };

    const summary = `${title ?? 'Incident'} near ${location ?? 'the affected area'} requires rapid triage.`;
    const priorityScore = Math.min(98, 70 + (severity === 'Critical' ? 20 : severity === 'High' ? 15 : severity === 'Medium' ? 10 : 5));

    return NextResponse.json({
      summary,
      severity: severity ?? 'High',
      priorityScore,
      resources: ['Medical unit', 'Volunteer team', 'Safety crew'],
      safetyRecommendations: ['Secure the perimeter', 'Maintain clear evacuation routes'],
    });
  } catch {
    return NextResponse.json({ error: 'AI analysis unavailable' }, { status: 500 });
  }
}
