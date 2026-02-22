import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { title, location } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const description = await withAIFallback(async () => {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You generate concise, professional event descriptions (2-3 sentences). Return JSON with a "description" field.',
        },
        {
          role: 'user',
          content: `Generate a description for an event titled "${title}"${location ? ` at ${location}` : ''}.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    return parsed.description ?? null;
  }, null);

  if (!description) {
    return NextResponse.json({ error: 'Could not generate description' }, { status: 422 });
  }

  return NextResponse.json({ description });
}
