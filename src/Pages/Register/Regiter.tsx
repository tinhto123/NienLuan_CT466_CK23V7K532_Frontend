import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'src/components/Input'
import { useMutation } from '@tanstack/react-query'
import auth from 'src/api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from 'src/context/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type formData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const regiterSchema = schema.pick(['email', 'password', 'confirm_password'])
export default function Regiter() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(regiterSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<formData, 'confirm_password'>) => auth.registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, 'confirm_password')
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        const message = data.data.message
        toast.success(message)
        setProfile(data.data.data.user)
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<formData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<formData, 'confirm_password'>, {
                type: 'Server',
                message: formError[key as keyof Omit<formData, 'confirm_password'>]
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng kí</div>
              <Input
                name='email'
                register={register}
                className='mt-8'
                errorsMessgae={errors.email?.message}
                placeholder='Email'
                type='email'
              />
              <Input
                name='password'
                register={register}
                className='mt-3'
                errorsMessgae={errors.password?.message}
                placeholder='Password'
                type='password'
              />
              <Input
                name='confirm_password'
                register={register}
                className='mt-3'
                errorsMessgae={errors.confirm_password?.message}
                placeholder='Confirm Password'
                type='password'
              />
              <Button
                disabled={registerAccountMutation.isLoading}
                isLoading={registerAccountMutation.isLoading}
                className=' mt-8 flex w-full items-center justify-center rounded bg-red-500 p-4 text-white hover:bg-red-600'
              >
                Đăng Kí
              </Button>
              <div className='mt-5 flex justify-center '>
                <p className='text-sm text-gray-500'>Bạn đã có tài khoản?</p>
                <Link className='mx-2 text-red-400 hover:text-red-500' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
