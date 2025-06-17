import { NextResponse } from 'next/server';
import serverApi from '@/app/lib/serverApi'; 


export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    const body = await request.json(); // Get the update data from the client

    // Use serverApi to securely forward this to Django
    const backendResponse = await serverApi(`/api/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error(`API proxy error in /api/tasks/[id] PATCH:`, error);
    return NextResponse.json({ detail: 'An error occurred while updating the task.' }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;

    const backendResponse = await serverApi(`/api/tasks/${id}/`, {
      method: 'DELETE',
    });

    // Django's DELETE often returns a 204 No Content response, which has no body.
    if (backendResponse.status !== 204) {
      const data = await backendResponse.json();
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // Return the successful 204 No Content response to the client.
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`API proxy error in /api/tasks/[id] DELETE:`, error);
    return NextResponse.json({ detail: 'An error occurred while deleting the task.' }, { status: 500 });
  }
}