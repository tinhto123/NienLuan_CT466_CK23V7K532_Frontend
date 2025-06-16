import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import auth from 'src/api/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/context/app.context'
import { Schema, schema } from 'src/utils/rules'

type formData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(loginSchema)
  })
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: (body: Omit<formData, 'confirm_password'>) => auth.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        const message = data.data.message
        toast.success(message)
        setProfile(data.data.data.user)
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error: any) => {
        const message = error.response.data.data.password
        toast.error(message)
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Nhập</div>
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
              <Button
                type='submit'
                isLoading={loginMutation.isLoading}
                disabled={loginMutation.isLoading}
                className='mt-5 flex w-full items-center justify-center rounded bg-red-500 p-4 text-white hover:bg-red-600'
              >
                Đăng Nhập
              </Button>
              <div className='mt-5 flex justify-center '>
                <p className='text-sm text-gray-500'>Bạn chưa có tài khoản?</p>
                <Link className='mx-2 text-red-400 hover:text-red-500' to={path.register}>
                  Đăng kí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
