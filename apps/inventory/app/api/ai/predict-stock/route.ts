import { NextResponse } from 'next/server';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';
import { PREDICT_STOCK_PROMPT } from '@/lib/ai/prompts';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const [lowStockItems, recentActivity] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: {
          OR: [
            { status: 'LOW_STOCK' },
            { status: 'IN_STOCK' },
          ],
        },
        select: {
          id: true,
          name: true,
          quantity: true,
          minStock: true,
          maxStock: true,
          status: true,
        },
        orderBy: { quantity: 'asc' },
        take: 20,
      }),
      prisma.activity.findMany({
        where: {
          action: { in: ['UPDATED', 'STATUS_CHANGE'] },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: {
          action: true,
          details: true,
          itemId: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    const predictions = await withAIFallback(
      async () => {
        const openai = getOpenAIClient();

        const dataContext = JSON.stringify({
          items: lowStockItems,
          recentActivity: recentActivity.slice(0, 20),
        });

        const completion = await openai.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: PREDICT_STOCK_PROMPT },
            { role: 'user', content: dataContext },
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content?.trim();
        if (!content) return [];

        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : (parsed.predictions ?? []);
      },
      // Fallback: simple rule-based predictions
      lowStockItems
        .filter((item) => item.quantity <= item.minStock && item.quantity > 0)
        .map((item) => ({
          itemId: item.id,
          itemName: item.name,
          currentQuantity: item.quantity,
          daysUntilEmpty: Math.max(1, Math.round(item.quantity * 3)),
          recommendation: `Reorder soon. Current stock (${item.quantity}) is at or below minimum (${item.minStock}).`,
        }))
    );

    return NextResponse.json({ predictions });
  } catch {
    return NextResponse.json({ predictions: [] });
  }
}
