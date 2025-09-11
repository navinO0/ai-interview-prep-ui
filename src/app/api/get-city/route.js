// app/api/get-city/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const response = await fetch('https://ipapi.co/json/');
    // const data = await response.json();

    return NextResponse.json({ city: 'tirupati' });
  } catch (error) {
    console.log('Failed to fetch city:', error);
    return NextResponse.json({ error: 'Failed to fetch city' }, { status: 500 });
  }
}
