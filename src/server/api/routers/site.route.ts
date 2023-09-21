import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const siteRouter = createTRPCRouter({
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const site = await ctx.prisma.site.findUnique({
      where: {
        userId: ctx.session.user.id ?? '',
      },
    })

    const links = await ctx.prisma.link.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })

    let click = 0

    links.map((link) => (click += link.clickCount))

    const views = site?.viewCount ?? 0
    const ctr = (click / views) * 100

    return {
      views,
      click,
      ctr,
    }
  }),
  updateSiteProfile: protectedProcedure
    .input(
      z.object({
        profileTitle: z.string().optional(),
        bio: z.string().optional(),
        profileImage: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.site.upsert({
        create: {
          profileTitle: input.profileTitle,
          bio: input.bio,
          profileImage: input.profileImage,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
        },
        where: {
          userId: ctx.session.user.id ?? undefined,
        },
        update: {
          profileTitle: input.profileTitle,
          bio: input.bio,
          profileImage: input.profileImage,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
        },
      })
      return user
    }),

  getSiteProfile: protectedProcedure.query(async ({ ctx }) => {
    const site = await ctx.prisma.site.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    })

    return site
  }),
})
