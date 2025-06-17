import { NextResponse } from 'next/server';
import { handleLogin } from '@/app/lib/actions';

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const backendResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // dj-rest-auth's custom register view returns tokens directly
    if (data.user && data.access && data.refresh) {
      await handleLogin(data.user.pk.toString(), data.access, data.refresh);
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("API proxy error in /api/auth/register POST:", error);
    return NextResponse.json({ detail: 'An internal error occurred.' }, { status: 500 });
  }
}