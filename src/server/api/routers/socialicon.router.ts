import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const socialIconRouter = createTRPCRouter({
  addSocialIcon: protectedProcedure
    .input(
      z.object({
        iconId: z.number(),
        url: z.string().optional(),
        active: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const socialIcon = await ctx.prisma.socialIcon.create({
        data: {
          iconId: input.iconId,
          url: input.url ?? '',
          active: input.active,
          userId: ctx.session.user.id,
        },
      })

      return socialIcon
    }),

  getSocialIcon: publicProcedure.query(({ ctx }) => {
    const socialIcon = ctx.prisma.socialIcon.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    })

    return socialIcon
  }),

  updateSocialIcon: protectedProcedure
    .input(
      z.object({
        socialIconId: z.string(),
        url: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const socialIcon = await ctx.prisma.socialIcon.update({
        data: {
          url: input.url,
          active: input.active,
        },
        where: {
          id: input.socialIconId,
        },
      })

      return socialIcon
    }),

  deleteSocialIcon: protectedProcedure
    .input(
      z.object({
        socialIconId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const socialIcon = await ctx.prisma.socialIcon.delete({
        where: {
          id: input.socialIconId,
        },
      })

      return socialIcon
    }),
})
