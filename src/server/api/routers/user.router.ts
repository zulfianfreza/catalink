import { z } from 'zod'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    })

    return user
  }),
  getProfileByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      })

      return user
    }),

  checkUsernameIsAvailable: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const check = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      })

      if (check) {
        return false
      }

      return true
    }),

  changeUsername: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        data: {
          username: input.username,
        },
        where: {
          id: ctx.session.user.id ?? undefined,
        },
      })

      return user
    }),
})
