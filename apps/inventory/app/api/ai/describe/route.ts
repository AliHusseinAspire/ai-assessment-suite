import { NextResponse, type NextRequest } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';
import { DESCRIBE_PROMPT } from '@/lib/ai/prompts';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const description = await withAIFallback(
      async () => {
        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: DESCRIBE_PROMPT },
            { role: 'user', content: name },
          ],
          temperature: 0.7,
          max_tokens: 200,
        });

        return completion.choices[0]?.message?.content?.trim() ?? '';
      },
      ''
    );

    return NextResponse.json({ description });
  } catch {
    return NextResponse.json({ description: '' });
  }
}
