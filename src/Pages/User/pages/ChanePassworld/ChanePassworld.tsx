import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { changePasswordSchema } from 'src/utils/rules'
import userApi from 'src/api/user.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'

type FormData = {
  password: string
  new_password: string
  confirm_password: string
}

export default function ChanePassworld() {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })

  const changePasswordMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => {
      return userApi.changePassword(body)
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await changePasswordMutation.mutateAsync(data)
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('change_password_title')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('change_password_description')}</div>
      </div>
      <form className='mr-auto mt-8 max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('old_password')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                type='password'
                placeholder={t('enter_old_password')}
                {...register('password')}
              />
              <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errors.password?.message}</div>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('new_password')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                type='password'
                placeholder={t('enter_new_password')}
                {...register('new_password')}
              />
              <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errors.new_password?.message}</div>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('confirm_password')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                type='password'
                placeholder={t('enter_confirm_password')}
                {...register('confirm_password')}
              />
              <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errors.confirm_password?.message}</div>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
