import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const filters = await withAIFallback(async () => {
    const client = getOpenAIClient();

    const now = new Date();

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You convert natural language event search queries into structured filters. Current date: ${now.toISOString()}. Return JSON with these optional fields:
- search: string (text to search in title/description)
- status: string (one of: UPCOMING, ONGOING, PAST, CANCELLED)

Examples:
- "meetings next week" → { "search": "meeting", "status": "UPCOMING" }
- "cancelled events" → { "status": "CANCELLED" }
- "past team standup" → { "search": "team standup", "status": "PAST" }
- "all upcoming" → { "status": "UPCOMING" }`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content);
  }, null);

  if (!filters) {
    return NextResponse.json({ filters: { search: query } });
  }

  return NextResponse.json({ filters });
}
