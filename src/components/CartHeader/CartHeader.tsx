import { Link } from 'react-router-dom'
import NavHeader from '../NavHeader'
import useSearchProducts from 'src/hooks/useSearchProducts'

export default function CartHeader() {
  const { onSubmitSearch, register } = useSearchProducts()

  return (
    <div className='border-b border-b-black/10'>
      <div className='bg-orange text-white'>
        <NavHeader />
      </div>
      <div className='bg-white py-6'>
        <div className='container'>
          <nav className='md:flex md:items-center md:justify-between'>
            <Link to={'/'} className='flex flex-shrink-0 items-center justify-center'>
              <div>
                <img
                  src='https://png.pngtree.com/png-clipart/20190705/original/pngtree-hand-drawn-cute-standing-penguin-png-image_4361050.jpg'
                  alt='Shop Logo'
                  style={{
                    objectFit: 'cover',
                    background: '#fff',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px'
                  }}
                />
              </div>
              <div className='mx-4 h-6 w-[1px] bg-orange md:h-8'></div>
              <div className='capitalize text-orange md:text-xl'>giỏ hàng</div>
            </Link>
            <form className='mt-3 md:mt-0 md:w-[50%]' onSubmit={onSubmitSearch}>
              <div className='flex rounded-sm border-2 border-orange'>
                <input
                  className='w-full flex-grow border-none bg-transparent px-3 py-1 text-sm capitalize text-black outline-none md:text-base'
                  type='text'
                  placeholder='Free ship đơn từ 0Đ'
                  {...register('name')}
                />
                <button className='flex-shrink-0 rounded-sm bg-orange px-4 py-2 hover:opacity-90 sm:px-8'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-5 w-5 stroke-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                    ></path>
                  </svg>
                </button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </div>
  )
}
