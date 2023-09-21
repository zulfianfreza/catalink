interface PreviewPageProps {
  domain: string
}

export default function PreviewPage({ domain }: PreviewPageProps) {
  return (
    <div className='fixed right-0 hidden h-screen border-l-[1px] border-gray-200 p-4 pt-20 md:block md:w-[316px] lg:w-[435px] xl:w-[568px]'>
      <div className=' relative z-50 flex -translate-y-24 flex-col items-center justify-center'>
        <div className=' test relative z-10 h-[724px] w-[352px] translate-y-6 overflow-hidden rounded-[56px] border-[12px] border-black md:scale-50 lg:scale-[0.6] xl:scale-[0.65]'>
          <div className=' absolute left-1/2 top-5 h-6 w-[100px] -translate-x-1/2 rounded-full bg-black'></div>
          <iframe
            src={domain}
            className=' h-full w-full overflow-hidden rounded-[44px]'
            id='preview-page'
          />
        </div>
        <div className=' absolute bottom-8 z-50'></div>
      </div>
    </div>
  )
}
