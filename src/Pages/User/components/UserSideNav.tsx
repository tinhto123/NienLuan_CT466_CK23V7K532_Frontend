import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/context/app.context'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation()
  const active = (isActive: any) => {
    return classNames('flex mt-4 items-center capitalize transition-colors', {
      'text-orange ': isActive,
      'text-gray-600': !isActive
    })
  }
  return (
    <div>
      <div className='flex items-center border-b border-gray-200 text-gray-600'>
        <Link to={path.profile}>
          {profile?.avatar ? (
            <img
              className='h-12 w-12 overflow-hidden rounded-full border border-black/10 object-cover'
              src={profile?.avatar}
              alt='anh'
            />
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-8 w-8'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          )}
        </Link>
        <div className=' flex-grow-0 pl-4'>
          <div className='mb-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-gray-600'>
            {profile?.name ? profile.name : profile?.email}
          </div>
          <Link to={'/user/profile'} className='flex items-center capitalize text-gray-500'>
            <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: '4px' }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              ></path>
            </svg>
            {t('edit_profile')}
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink to={path.profile} className={({ isActive }) => active(isActive)}>
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
          </div>
          {t('my_account')}
        </NavLink>
        <NavLink to={path.changePassword} className={({ isActive }) => active(isActive)}>
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
          </div>
          {t('change_password')}
        </NavLink>
        <NavLink to={path.historyPurchase} className={({ isActive }) => active(isActive)}>
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078' alt='' className='h-full w-full' />
          </div>
          {t('my_purchase')}
        </NavLink>
        {profile?.roles?.includes('Admin') && (
          <>
            <NavLink to={path.orderManagement} className={({ isActive }) => active(isActive)}>
              <div className='mr-3 h-[22px] w-[22px]'>
                <img
                  src='https://cf.shopee.vn/file/84feaa363ce325071c0a66d3c9a88748'
                  alt=''
                  className='h-full w-full'
                />
              </div>
              {t('order_management')}
            </NavLink>
            <NavLink to={'/user/category-management'} className={({ isActive }) => active(isActive)}>
              <div className='mr-3 h-[22px] w-[22px]'>
                <img src='https://cdn-icons-png.flaticon.com/512/3595/3595455.png' alt='' className='h-full w-full' />
              </div>
              {t('category_management')}
            </NavLink>
            <NavLink to={'/user/product-management'} className={({ isActive }) => active(isActive)}>
              <div className='mr-3 h-[22px] w-[22px]'>
                <img src='https://cdn-icons-png.flaticon.com/512/1524/1524855.png' alt='' className='h-full w-full' />
              </div>
              {t('product_management')}
            </NavLink>
          </>
        )}
      </div>
    </div>
  )
}
