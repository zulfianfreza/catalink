import { Link } from '@prisma/client'
import { z } from 'zod'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '~/server/api/trpc'

export const linkRouter = createTRPCRouter({
  getLinks: publicProcedure.query(async ({ ctx }) => {
    const links = await ctx.prisma.link.findMany({
      where: {
        userId: ctx.session!.user.id,
      },
      orderBy: [{ index: 'asc' }],
    })

    return links
  }),
  getLinksByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      })

      const links = await ctx.prisma.link.findMany({
        where: {
          userId: user ? user.id : null,
        },
        orderBy: [{ index: 'asc' }],
      })

      return links
    }),
  createLink: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        label: z.string(),
        content: z.string().optional(),
        headerPosition: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const find = await ctx.prisma.link.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      })

      const index = find.length

      const links = ctx.prisma.link.create({
        data: {
          type: input.type,
          label: input.label,
          content: input.content,
          active: true,
          index,
          userId: ctx.session.user.id,
          clickCount: 0,
          headerPosition: input.headerPosition,
        },
      })

      return links
    }),

  incrementClickCount: publicProcedure
    .input(z.object({ linkId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.link.update({
        data: {
          clickCount: {
            increment: 1,
          },
        },
        where: {
          id: input.linkId,
        },
      })
    }),

  updateLink: protectedProcedure
    .input(
      z.object({
        linkId: z.string(),
        label: z.string().optional(),
        content: z.string().optional(),
        active: z.boolean().optional(),
        thumbnailType: z.string().optional(),
        imageUrl: z.string().optional(),
        iconId: z.number().optional(),
        headerPosition: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.link.update({
        where: {
          id: input.linkId,
        },
        data: {
          label: input.label,
          content: input.content,
          active: input.active,
          thumbnailType: input.thumbnailType,
          imageUrl: input.imageUrl,
          iconId: input.iconId,
          headerPosition: input.headerPosition,
        },
      })
    }),

  deleteLink: protectedProcedure
    .input(
      z.object({
        linkId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.link.delete({
        where: {
          id: input.linkId,
        },
      })
    }),

  reorderLinkPosition: protectedProcedure
    .input(
      z.object({
        newIndex: z.number(),
        oldIndex: z.number(),
        linkId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { oldIndex, newIndex } = input
      const links = await ctx.prisma.link.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: [{ index: 'asc' }],
      })
      let link: Link | undefined
      if (
        oldIndex >= 0 &&
        oldIndex < links.length &&
        newIndex >= 0 &&
        newIndex < links.length
      ) {
        link = links.splice(oldIndex, 1)[0]

        links.splice(newIndex, 0, link!)

        for (let i = 0; i < links.length; i++) {
          links[i]!.index = i
          await ctx.prisma.link.update({
            where: {
              id: links[i]?.id,
            },
            data: {
              index: i,
            },
          })
        }
      }

      return links
    }),
})
