import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Context } from '~/server/api/context'

export default function page({ user }: { user: any }) {
  return <div className=''>{JSON.stringify(user)}</div>
}

interface PageProps {
  ctx: GetServerSidePropsContext
  trpc: Context
}

export async function getServerSideProps(ctx: Context) {
  console.log(ctx.session)
  return {
    props: {},
  }
}
