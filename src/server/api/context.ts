import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { Session } from 'next-auth'
import { prisma } from '~/lib/db'
import { getServerAuthSession } from '../../lib/auth'
import { inferAsyncReturnType } from '@trpc/server'

type CreateContextOptions = {
  session: Session | null
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  }
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  const session = await getServerAuthSession({ req, res })

  return createInnerTRPCContext({
    session,
  })
}

export type Context = inferAsyncReturnType<typeof createTRPCContext>
