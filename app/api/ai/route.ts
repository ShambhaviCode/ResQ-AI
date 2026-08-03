import { NextResponse } from 'next/server';
import { createAiAnalysisPayload } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, location, severity, description } = body as {
      title?: string;
      location?: string;
      severity?: string;
      description?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Analyze this emergency incident and return JSON with summary, severity, priorityScore, resources, safetyRecommendations. Title: ${title ?? 'Incident'}; Description: ${description ?? 'N/A'}; Location: ${location ?? 'N/A'}; Severity: ${severity ?? 'High'}` }],
          }],
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const cleaned = text.replace(/```json|```/g, '').trim();
        try {
          const parsed = JSON.parse(cleaned);
          return NextResponse.json({
            summary: parsed.summary ?? createAiAnalysisPayload({ title, location, severity, description }).summary,
            severity: parsed.severity ?? severity ?? 'High',
            priorityScore: Number(parsed.priorityScore ?? 72),
            resources: Array.isArray(parsed.resources) ? parsed.resources : createAiAnalysisPayload({ title, location, severity, description }).resources,
            safetyRecommendations: Array.isArray(parsed.safetyRecommendations) ? parsed.safetyRecommendations : createAiAnalysisPayload({ title, location, severity, description }).safetyRecommendations,
          });
        } catch {
          return NextResponse.json(createAiAnalysisPayload({ title, location, severity, description }));
        }
      }
    }

    return NextResponse.json(createAiAnalysisPayload({ title, location, severity, description }));
  } catch {
    return NextResponse.json({ error: 'AI analysis unavailable' }, { status: 500 });
  }
}
