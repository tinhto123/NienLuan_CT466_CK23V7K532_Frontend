import { Link } from 'react-router-dom'
import Popover from '../Popover'
import { useQuery } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/api/purchase.api'
import { formatCurrency } from 'src/utils/utils'
import NavHeader from '../NavHeader'
import { useContext } from 'react'
import { AppContext } from 'src/context/app.context'
import useSearchProducts from 'src/hooks/useSearchProducts'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { isAuthenticated } = useContext(AppContext)
  const { onSubmitSearch, register } = useSearchProducts()
  const { t } = useTranslation()

  const { data: getProductInCart } = useQuery({
    queryKey: ['purchase', purchasesStatus.inCart],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })
  const productInCart = getProductInCart?.data.data
  const MAX_PURCHASES = 5

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <NavHeader />

        <div className='grid grid-cols-12 py-2'>
          <Link to='/' className='col-span-2'>
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
          </Link>
          <form className='relative col-span-9 mx-2 flex-grow' onSubmit={onSubmitSearch}>
            <div className=' flex items-center rounded-sm bg-white p-1 '>
              <input
                className='bg-orangebg-transparent h-full w-full flex-grow border-none p-1 text-sm text-black outline-none'
                placeholder={t('search_placeholder')}
                {...register('name')}
              />
              <button className=' flex-shrink-0 rounded-sm bg-orange px-3 py-1 hover:opacity-90'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0s 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <Link to={'/'} className='col-span-1 flex items-end justify-end'>
            <Popover
              placement='bottom-end'
              renderProps={
                <div className='border-gay-200 relative max-w-[300px] rounded-sm border bg-white shadow-md md:max-w-[400px]'>
                  {productInCart?.length !== 0 && productInCart !== undefined ? (
                    <div className='p-2'>
                      <div className='text-sm capitalize text-gray-400'>{t('cart_popover_header')}</div>
                      {productInCart?.slice(0, MAX_PURCHASES).map((purchase) => (
                        <div className='mt-5 flex cursor-pointer hover:bg-gray-50' key={purchase.product._id}>
                          <div className='flex-shrink-0'>
                            <img className='h-11 w-11' src={purchase.product.image} alt={purchase.product.name} />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>{purchase.product.name}</div>
                          </div>
                          <div className='ml-2 flex-shrink-0'>
                            <span className='text-orange'>
                              ₫
                              {purchase.product.price
                                ? formatCurrency(purchase.product.price)
                                : formatCurrency(purchase.product.price_before_discount)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>
                          {productInCart.length > MAX_PURCHASES ? productInCart?.length - MAX_PURCHASES : ''}
                          {t('cart_popover_bottom_left')}
                        </div>
                        <Link className='bg-orange px-4 py-2 capitalize text-white hover:opacity-90 ' to={'/cart'}>
                          {t('btn_go_to_cart')}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                      <img className='h-24 w-24' src='/assets/cart_emty.jpg' alt='anh' />
                      <p className='text-sm capitalize'>Chưa có sản phẩm</p>
                    </div>
                  )}
                </div>
              }
            >
              <Link to={'/'} className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-8 w-8 '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                <div className='absolute right-[-6px] top-[-2px] rounded-lg bg-white px-2 text-xs text-orange'>
                  {productInCart?.length}
                </div>
              </Link>
            </Popover>
          </Link>
        </div>
      </div>
    </div>
  )
}
