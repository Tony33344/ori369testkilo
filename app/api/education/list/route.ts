import { NextResponse } from 'next/server';
import { getEducationOverview } from '@/lib/education';

export async function GET() {
  try {
    const courses = await getEducationOverview();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Failed to list education courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
