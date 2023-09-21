import { createTRPCRouter } from '~/server/api/trpc'
import { linkRouter } from './routers/link.router'
import { userRouter } from './routers/user.router'
import { themeRouter } from './routers/theme.router'
import { socialIconRouter } from './routers/socialicon.router'
import { siteRouter } from './routers/site.route'

export const appRouter = createTRPCRouter({
  link: linkRouter,
  user: userRouter,
  theme: themeRouter,
  socialicon: socialIconRouter,
  site: siteRouter,
})

export type AppRouter = typeof appRouter
