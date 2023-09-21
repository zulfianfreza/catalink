import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { trpc } from '~/lib/trpc'
import '~/styles/globals.css'
import { Poppins } from 'next/font/google'
import { cn } from '~/lib/utils'
import { DefaultSeo } from 'next-seo'
import Providers from '~/components/Providers'
import 'react-loading-skeleton/dist/skeleton.css'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Providers>
        <div className={cn(font.className, '')}>
          <DefaultSeo title='Circle' />
          <Component {...pageProps} className={font.className} />
        </div>
      </Providers>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
