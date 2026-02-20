import { NextResponse, type NextRequest } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';
import { SEARCH_PROMPT } from '@/lib/ai/prompts';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const filters = await withAIFallback(
      async () => {
        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SEARCH_PROMPT },
            { role: 'user', content: query },
          ],
          temperature: 0.1,
          max_tokens: 200,
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content?.trim();
        if (!content) return { search: query };

        return JSON.parse(content);
      },
      { search: query }
    );

    // Map category name to ID if present
    if (filters.category) {
      const category = await prisma.category.findFirst({
        where: { name: { contains: filters.category, mode: 'insensitive' } },
      });
      if (category) {
        filters.categoryId = category.id;
      }
      delete filters.category;
    }

    return NextResponse.json({ filters });
  } catch {
    return NextResponse.json({ error: 'Failed to process search' }, { status: 500 });
  }
}
