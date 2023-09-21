import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import useDebounce from '~/hooks/useDebounce'
import { prisma } from '~/lib/db'
import { trpc } from '~/lib/trpc'

export default function UsernamePage() {
  const [username, setUsername] = useState<string>('')
  const debounceUsername = useDebounce(username, 500)
  const router = useRouter()
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const changeUsernameMutation = trpc.user.changeUsername.useMutation({
    onSuccess: () => {
      toast.success('success')
      router.push('/dashboard')
    },
  })

  const handleSubmit = () => {
    changeUsernameMutation.mutateAsync({ username: debounceUsername })
  }

  const checkUsernameMutation = trpc.user.checkUsernameIsAvailable.useMutation({
    onSuccess(data) {
      if (data) {
        setIsAvailable(true)
      } else {
        setIsAvailable(false)
        setError('The username is already taken')
      }
    },
  })

  const checkUsername = () => {
    checkUsernameMutation.mutateAsync({ username: debounceUsername })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    setError('')
  }

  useEffect(() => {
    if (username != '') {
      if (debounceUsername.length < 3) {
        setError('Username must be 3 characters or longer')
        setIsAvailable(false)
      } else {
        setError('')
        checkUsername()
      }
    } else {
      setError('Please enter a username')
      setIsAvailable(false)
    }
  }, [debounceUsername])

  useEffect(() => {
    setError('')
  }, [])

  return (
    <div className=' flex min-h-screen bg-white'>
      <div className=' w-full md:w-2/3'>
        <div className=' flex justify-center p-10'>
          <div className=' flex w-[640px] flex-col justify-center p-10 pt-28'>
            <div className=' text-center'>
              <h1 className=' text-[44px] font-bold'>Welcome to Circle</h1>
              <p className=' text-gray-500'>Choose your Circle username.</p>
            </div>
            <div className=''>
              <div className=' mt-16 space-y-2'>
                <div className=' h-12 w-full rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-black hover:ring-2 hover:ring-gray-300 hover:focus-within:ring-2 hover:focus-within:ring-black'>
                  <div className=' flex h-full items-center'>
                    <label htmlFor='' className=' ml-4 text-sm text-gray-500'>
                      circle.link/
                    </label>
                    <input
                      type='text'
                      value={username}
                      onChange={handleChange}
                      id='username'
                      className=' h-12 w-full bg-transparent pr-4 text-sm focus:outline-none'
                    />
                  </div>
                </div>
                {error != '' && (
                  <p className=' text-sm text-red-700'>{error}</p>
                )}
              </div>
              <p className=' mt-4 text-center text-sm text-gray-500'>
                By continuing, you agree to receive offers, news and update from
                hyprr.
              </p>
              <div className=' mt-8 flex flex-col items-center gap-y-2'>
                <button
                  type='submit'
                  onClick={handleSubmit}
                  disabled={!isAvailable}
                  className=' flex h-12 w-full items-center justify-center rounded-full bg-violet-700 text-sm font-medium text-white disabled:bg-neutral-300'
                >
                  <p>Continue</p>
                </button>
              </div>
            </div>
            <p className=' mt-4 text-center text-sm'>
              Already have an account?{' '}
              <Link href='/login' className=' text-violet-700 underline'>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className=' hidden h-screen w-1/3 bg-violet-900 md:flex'></div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  })

  if (user?.username != null || user?.username) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
