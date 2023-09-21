import { trpc } from '~/lib/trpc'
import PreviewPage from '../PreviewPage'
import { Navbar } from '../navbar'
import * as React from 'react'

interface DashboardTemplateProps {
  children: React.ReactNode
}

export function DashboardTemplate(props: DashboardTemplateProps) {
  const [domain, setDomain] = React.useState<string>('')
  const { data } = trpc.user.getCurrentUser.useQuery(undefined, {
    onSuccess(data) {
      setDomain(`${window.location.origin}/${data?.username}?isDemo=true`)
    },
  })
  return (
    <>
      <Navbar />
      <div className=' flex w-full bg-gray-100'>
        <PreviewPage domain={domain} />
        {props.children}
      </div>
    </>
  )
}
