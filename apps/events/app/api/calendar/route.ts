import { NextRequest, NextResponse } from 'next/server';
import { getEventsForMonth } from '@/features/events/queries';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const year = parseInt(searchParams.get('year') ?? new Date().getFullYear().toString());
  const month = parseInt(searchParams.get('month') ?? new Date().getMonth().toString());

  try {
    const events = await getEventsForMonth(year, month);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Calendar fetch error:', error);
    return NextResponse.json({ events: [] });
  }
}
