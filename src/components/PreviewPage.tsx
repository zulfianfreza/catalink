import usePreviewLoading from '~/hooks/usePreviewLoading'

interface PreviewPageProps {
  domain: string
}

export default function PreviewPage({ domain }: PreviewPageProps) {
  const { isLoading } = usePreviewLoading()
  return (
    <div className='fixed right-0 hidden h-screen border-l-[1px] border-gray-200 p-4 pt-20 md:block md:w-[316px] lg:w-[435px] xl:w-[568px]'>
      <div className=' relative z-50 flex -translate-y-24 flex-col items-center justify-center'>
        <div className=' relative z-10 h-[724px] w-[358px] translate-y-6 overflow-hidden rounded-[56px] md:scale-50 lg:scale-[0.6] xl:scale-[0.65]'>
          <div className=' h-full w-full p-4'>
            <iframe
              src={domain}
              className=' h-full w-full overflow-hidden rounded-[44px]'
              id='preview-page'
            />
            <div className=' absolute left-8 top-8'>
              {isLoading && (
                <svg
                  className='-ml-1 mr-3 h-6 w-6 animate-spin text-sky-500'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx={12}
                    cy={12}
                    r={10}
                    stroke='currentColor'
                    strokeWidth={4}
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className=' absolute top-6 z-20 h-[724px] w-[358px] bg-[url("/images/frame.png")] bg-contain md:scale-50 lg:scale-[0.6] xl:scale-[0.65]'></div>
        <div className=' absolute bottom-8 z-50'></div>
      </div>
    </div>
  )
}
