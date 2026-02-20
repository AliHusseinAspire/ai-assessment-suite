import { NextResponse, type NextRequest } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';
import { CATEGORIZE_PROMPT } from '@/lib/ai/prompts';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const categoryList = categories.map((c) => c.name).join(', ');

    const result = await withAIFallback(
      async () => {
        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: CATEGORIZE_PROMPT.replace('{categories}', categoryList) },
            { role: 'user', content: name },
          ],
          temperature: 0.1,
          max_tokens: 100,
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content?.trim();
        if (!content) return null;

        return JSON.parse(content);
      },
      null
    );

    if (!result) {
      return NextResponse.json({ categoryId: null });
    }

    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === result.categoryName?.toLowerCase()
    );

    return NextResponse.json({
      categoryId: matchedCategory?.id ?? null,
      categoryName: result.categoryName,
      confidence: result.confidence,
    });
  } catch {
    return NextResponse.json({ categoryId: null });
  }
}
