import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { text } = await request.json();

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const parsed = await withAIFallback(async () => {
    const client = getOpenAIClient();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You parse natural language event descriptions into structured data. Current date/time: ${now.toISOString()}. Return JSON with these fields:
- title: string (the event name)
- description: string (optional, brief description)
- location: string (optional)
- startDate: string (ISO datetime format, e.g. "2026-02-21T09:00")
- endDate: string (ISO datetime format, should be after startDate)
- allDay: string ("true" or "false")

For relative dates like "tomorrow", "next Monday", calculate from current date. If no time is specified, default to 9:00 AM start, 10:00 AM end. If no end time, default to 1 hour after start.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content);
  }, null);

  if (!parsed) {
    return NextResponse.json({ error: 'Could not parse event' }, { status: 422 });
  }

  return NextResponse.json({ parsed });
}
