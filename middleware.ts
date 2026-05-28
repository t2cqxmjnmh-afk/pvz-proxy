import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// This grabs your REST_URL and TOKEN automatically from your env variables
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Limits: 20 requests every 10 seconds
  limiter: Ratelimit.slidingWindow(20, '10 s'),
});

export async function middleware(request) {
  // Use the IP address to identify the "customer"
  const ip = request.ip ?? 'anonymous';
  
  const { success } = await ratelimit.limit(ip);

  // If they exceed 20, block them with a 429 "Too Many Requests" status
  if (!success) {
    return new NextResponse('Too Many Requests - Wait a bit!', { status: 429 });
  }

  return NextResponse.next();
}

// Only apply to your API routes to keep things fast
export const config = {
  matcher: '/api/:path*',
};
