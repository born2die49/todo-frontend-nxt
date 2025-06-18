import { NextResponse } from 'next/server';
import serverApi from '@/app/lib/serverApi';

export async function GET(request: Request) {
  try {
    const backendResponse = await serverApi('/api/auth/profile/',);

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // If even after a potential retry it's still not ok, pass the error on.
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ detail: 'An error occurred while fetching profile.' }, { status: 500 });
  }
}