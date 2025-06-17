import serverApi from "@/app/lib/serverApi";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Get the task data from the client's request
    const body = await request.json();

    // 2. Use serverApi to securely forward this to the Django backend
    // It will automatically add the auth token from the cookie
    const backendResponse = await serverApi('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    // 3. Get the response data from Django
    const data = await backendResponse.json();

    // 4. If Django sent an error, forward that error to our client
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // 5. If successful, forward the success response (the new task) to our client
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("API proxy error in /api/tasks POST:", error);
    return NextResponse.json({ detail: 'An error occurred while creating the task.' }, { status: 500 });
  }
}