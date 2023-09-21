interface ContentContainerProps {
  children: React.ReactNode
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <div className=' min-h-screen w-full pb-16 pt-32  md:w-[calc(100vw-316px)] md:pt-28 lg:w-[calc(100vw-435px)] xl:w-[calc(100vw-568px)]'>
      <div className=' mx-auto h-full w-full max-w-[640px] p-4'>{children}</div>
    </div>
  )
}

export default ContentContainer
