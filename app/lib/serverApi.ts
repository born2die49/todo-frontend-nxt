'use server';

import { cookies } from 'next/headers';
import { handleRefresh } from './actions';

async function serverApi(path: string, options: RequestInit = {}) {
    // 1. Get the access token from the cookies
    const accessToken = (await cookies()).get('session_access_token')?.value;

    // 2. Prepare the initial request
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        ...options, // Allow overriding defaults
    };

    if (accessToken) {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            'Authorization': `Bearer ${accessToken}`,
        };
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

    // 3. Make the first attempt
    let backendResponse  = await fetch(url, defaultOptions);

    // 4. Check for expired token and retry if necessary
    if (backendResponse.status === 401) {
      const errorData = await backendResponse.clone().json();

      if (errorData.code === 'token_not_valid') {
        console.log("Access token expired, attempting refresh...");

        const newAccessToken = await handleRefresh();

        if (newAccessToken) {
          console.log("Token refreshed, retrying original request...");

          if (defaultOptions.headers) {
            (defaultOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
          }

          // 5. Second attempt with new token
          backendResponse  = await fetch(url, defaultOptions);
        }
      }
    }

    return backendResponse;
}

export default serverApi;