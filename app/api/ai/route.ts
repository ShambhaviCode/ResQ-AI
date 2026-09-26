import { NextResponse } from 'next/server';
import { createAiAnalysisPayload, mergeModelAnalysis } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, location, severity, description } = body as {
      title?: string;
      location?: string;
      severity?: string;
      description?: string;
    };

    const fallback = createAiAnalysisPayload({ title, location, severity, description });

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      // Key goes in a header, not the URL, so it isn't captured in request logs.
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
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
          return NextResponse.json(mergeModelAnalysis(JSON.parse(cleaned), fallback));
        } catch {
          return NextResponse.json(fallback);
        }
      }
    }

    return NextResponse.json(fallback);
  } catch {
    return NextResponse.json({ error: 'AI analysis unavailable' }, { status: 500 });
  }
}
