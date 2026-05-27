import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Limits: 20 requests every 10 seconds
  limiter: Ratelimit.slidingWindow(20, '10 s'),
});

export async function middleware(request) {
  const ip = request.ip ?? 'anonymous';
  
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse('Too Many Requests - Wait a bit!', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
