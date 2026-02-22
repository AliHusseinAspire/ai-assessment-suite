import { NextRequest, NextResponse } from 'next/server';
import { getUserEventsForWeek } from '@/features/events/queries';
import { getOpenAIClient, withAIFallback } from '@/lib/ai/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const weekEvents = await getUserEventsForWeek(userId);

  const suggestions = await withAIFallback(async () => {
    const client = getOpenAIClient();

    const now = new Date();
    const eventList = weekEvents.length > 0
      ? weekEvents.map(
          (e) => `"${e.title}" ${e.startDate.toISOString()} – ${e.endDate.toISOString()}`
        ).join('\n')
      : 'No events this week';

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You analyze a user's weekly schedule and suggest 3-5 free time slots for new events. Current time: ${now.toISOString()}. Consider typical working hours (9 AM - 6 PM). Return JSON with a "suggestions" array of objects, each with "startTime" (human readable), "endTime" (human readable), and "reason" (brief explanation).`,
        },
        {
          role: 'user',
          content: `Here are my events this week:\n${eventList}\n\nSuggest 3-5 good times to schedule a new 1-hour event.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];
    const parsed = JSON.parse(content);
    return parsed.suggestions ?? [];
  }, []);

  return NextResponse.json({ suggestions });
}
