import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <section className='bg-white dark:bg-gray-900 '>
          <div className='mx-auto min-h-screen px-6  lg:flex lg:items-center lg:gap-12'>
            <div className='w-full lg:w-1/2'>
              <p className='text-sm font-extralight text-red-500 dark:text-blue-400'>500 error</p>
              <h1 className='mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl'> Lỗi hệ thống</h1>
              <p className='mt-4 text-gray-500 dark:text-gray-400'>Đây là một số liên kết hữu ích</p>

              <div className='mt-10 flex items-center gap-x-3'>
                <button className='flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-5 w-5 rtl:rotate-180'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18' />
                  </svg>

                  <span>Quay lại</span>
                </button>

                <a
                  href='/'
                  className='w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto'
                >
                  Trang chủ
                </a>
              </div>
            </div>

            <div className='relative mt-12 w-full lg:mt-0 lg:w-1/2'>
              <img
                className='w-full max-w-lg lg:mx-auto'
                src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/500/500.svg'
                alt=''
              />
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
