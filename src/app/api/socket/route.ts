import { NextRequest } from 'next/server'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { prisma } from '@/lib/prisma'
import { encryptMessage, decryptMessage } from '@/lib/socket'

export const dynamic = 'force-dynamic'

let io: ServerIO | undefined

export async function GET(request: NextRequest) {
  // This is a placeholder for the Socket.io server
  // In Next.js 13+ with app router, Socket.io setup is different
  // We'll handle this in a custom server file instead

  return new Response('Socket.io server endpoint', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}