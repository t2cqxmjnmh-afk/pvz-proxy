import { NextResponse } from 'next/server';

export function middleware(request) {
    const start = Date.now();
    
    // Log the start
    console.log(`[START] ${request.method} ${request.url}`);

    const response = NextResponse.next();

    // Log the end (using a custom header to track time)
    response.headers.set('x-response-time', `${Date.now() - start}ms`);
    console.log(`[END] ${request.url} took ${Date.now() - start}ms`);

    return response;
}
