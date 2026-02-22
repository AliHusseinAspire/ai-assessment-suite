import { NextRequest, NextResponse } from 'next/server';
import { checkConflicts } from '@/features/events/queries';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { startDate, endDate, userId, excludeEventId } = await request.json();

  if (!startDate || !endDate || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Code-level conflict detection
  const conflicts = await checkConflicts(
    new Date(startDate),
    new Date(endDate),
    userId,
    excludeEventId
  );

  // If conflicts found, get AI suggestions for resolution
  let suggestions: string[] = [];
  if (conflicts.length > 0) {
    suggestions = await withAIFallback(async () => {
      const client = getOpenAIClient();

      const conflictList = conflicts.map(
        (c) => `"${c.title}" (${new Date(c.startDate).toLocaleString()} – ${new Date(c.endDate).toLocaleString()})`
      ).join(', ');

      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You suggest alternative times when scheduling conflicts occur. Return JSON with a "suggestions" array of strings (2-3 brief suggestions).',
          },
          {
            role: 'user',
            content: `The user wants to schedule an event from ${startDate} to ${endDate}, but it conflicts with: ${conflictList}. Suggest 2-3 alternative approaches or times.`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return [];
      const parsed = JSON.parse(content);
      return parsed.suggestions ?? [];
    }, []);
  }

  return NextResponse.json({ conflicts, suggestions });
}
