import { NextResponse } from 'next/server';
import { handleLogin } from '@/app/lib/actions';

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // If Django returns an error (e.g., wrong password), forward it
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // If login is successful, `data` contains user info and tokens
    if (data.user && data.access && data.refresh) {
      // Use your server action to set the secure httpOnly cookies
      await handleLogin(data.user.pk.toString(), data.access, data.refresh);
    }

    // Return the response from Django to the client
    return NextResponse.json(data);

  } catch (error) {
    console.error("API proxy error in /api/auth/login POST:", error);
    return NextResponse.json({ detail: 'An internal error occurred.' }, { status: 500 });
  }
}