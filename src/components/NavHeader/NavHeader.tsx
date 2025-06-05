import { Link } from 'react-router-dom'
import Popover from '../Popover'
import path from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/context/app.context'
import { clearAccessTokenToLocalStorage } from 'src/utils/auth'
import authAPI from 'src/api/auth.api'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'
import { useTranslation } from 'react-i18next'

export default function NavHeader() {
  const { setIsAuthenticated, isAuthenticated, profile, isLanguage, setLanguage } = useContext(AppContext)

  const queryClient = useQueryClient()
  const { i18n, t } = useTranslation()
  const logoutMutation = useMutation({
    mutationFn: authAPI.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      clearAccessTokenToLocalStorage()
      toast.success('Đăng xuất thành công')
      queryClient.removeQueries(['purchase', purchasesStatus.inCart])
    }
  })
  const Logout = () => {
    logoutMutation.mutate()
  }
  const changeLanguage = () => {
    setLanguage(!isLanguage)
    i18n.changeLanguage(isLanguage ? 'vi' : 'en')
  }
  return (
    <div className='flex justify-end text-sm md:text-base'>
      <Popover
        placement='bottom-end'
        className={'flex cursor-pointer items-center justify-center py-1'}
        renderProps={
          <div className='border-gay-200 relative rounded-sm border bg-white shadow-md'>
            <div className='flex flex-col px-3 py-2'>
              <button className='px-3 py-2 hover:text-orange' onClick={changeLanguage}>
                Tiếng Việt
              </button>
              <button className='mt-1 px-3 py-2 hover:text-orange' onClick={changeLanguage}>
                Tiếng Anh
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='px-1'>{isLanguage ? 'English' : 'Tiếng Việt'}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='flex cursor-pointer items-center justify-end px-3 py-1'
          renderProps={
            <div className='border-gay-200 relative rounded-sm border bg-white shadow-md'>
              <div className='flex flex-col px-2 py-2'>
                <Link to={'/user/profile'} className=' px-5 py-2 text-left hover:bg-gray-100 hover:text-cyan-500'>
                  {t('my_account')}
                </Link>
                <Link to={'/user/purchase'} className='px-5 py-2 text-left hover:bg-gray-100 hover:text-cyan-500'>
                  {t('purchase')}
                </Link>
                <button className='mt-1 px-5 py-2 text-left hover:bg-gray-100 hover:text-cyan-500' onClick={Logout}>
                  {t('logout')}
                </button>
              </div>
            </div>
          }
        >
          <img className='h-6 w-6 rounded-full object-cover' src={profile?.avatar} alt='' />
          <span className='mx-1'>{profile?.email}</span>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center justify-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            {t('register')}
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40'></div>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            {t('login')}
          </Link>
        </div>
      )}
    </div>
  )
}
