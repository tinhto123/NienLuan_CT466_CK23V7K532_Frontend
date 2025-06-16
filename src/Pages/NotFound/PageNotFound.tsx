import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'

export default function PageNotFound() {
  const navigate = useNavigate()
  return (
    <section className='bg-white dark:bg-gray-900 '>
      <div className='mx-auto min-h-screen px-6  lg:flex lg:items-center lg:gap-12'>
        <div className='w-full lg:w-1/2'>
          <p className='text-sm font-medium text-blue-500 dark:text-blue-400'>404 error</p>
          <h1 className='mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl'>
            {' '}
            Trang bạn tìm kiếm không tồn tại
          </h1>
          <p className='mt-4 text-gray-500 dark:text-gray-400'>Đây là một số liên kết hữu ích</p>

          <div className='mt-10 flex items-center gap-x-3'>
            <button
              className='flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto'
              onClick={() => navigate(-1)}
            >
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

            <Link
              to={path.home}
              className='w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto'
            >
              Trang chủ
            </Link>
          </div>
        </div>

        <div className='relative mt-12 w-full lg:mt-0 lg:w-1/2'>
          <img
            className='w-full max-w-lg lg:mx-auto'
            src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg'
            alt=''
          />
        </div>
      </div>
    </section>
  )
}
