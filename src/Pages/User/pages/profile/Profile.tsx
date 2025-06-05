import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useContext, useEffect, useState, useMemo } from 'react'
import userApi from 'src/api/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputButton'
import { userSchema } from 'src/utils/rules'
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/context/app.context'
import { saveUserToLocalStorage } from 'src/utils/auth'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'

type FormData = {
  name: string | undefined
  phone: string | undefined
  address: string | undefined
  avatar: string | undefined
  date_of_birth: Date | undefined
}
type FormError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
function Info() {
  const {
    register,
    formState: { errors },
    control
  } = useFormContext<FormData>()
  return (
    <Fragment>
      <div className='  flex-wraps mt-2 flex flex-col sm:flex-row'>
        <div className='mt-3 truncate pt-3 capitalize sm:w-[20%] sm:text-left'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <div className='pt-3 text-gray-700'>
            <Input
              classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              placeholder='Tên'
              name='name'
              type='text'
              register={register}
              errorsMessgae={errors.name?.message}
            />
          </div>
        </div>
      </div>
      <div className='  flex-wraps  flex flex-col sm:flex-row'>
        <div className='mt-3 truncate pt-3 capitalize sm:w-[20%] sm:text-left'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <div className='pt-3 text-gray-700'>
            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <InputNumber
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Số điện thoại'
                  errorMessage={errors.phone?.message}
                  {...field}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
export default function Profile() {
  const [file, setFile] = useState<File>()
  const { setProfile } = useContext(AppContext)
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const methol = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    setError
  } = methol
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
      setValue('phone', profile.phone)
    }
  }, [profile, setValue])
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadResponse = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadResponse.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      refetch()
      setProfile(res.data.data)
      saveUserToLocalStorage(res.data.data)
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormError, {
              message: formError[key as keyof FormError],
              type: 'server'
            })
          })
        }
      }
    }
  })
  const onChangeFile = (event: File | undefined) => {
    setFile(event)
  }

  const avatar = watch('avatar')

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow  md:px-7 md:pb-20'>
      <div className='py-5 text-center text-xl capitalize text-black'>Hồ sơ của tôi</div>
      <div className='text-center text-sm text-gray-600'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      <div className='my-5 h-[1px] w-full bg-gray-200 px-4'></div>
      <FormProvider {...methol}>
        <form className='mt-8  flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-left'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='flex-wraps  flex flex-col sm:flex-row'>
              <div className='mt-3 truncate pt-3 capitalize sm:w-[20%] sm:text-left'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>
                  <Input
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Địa chỉ'
                    type='text'
                    name='address'
                    register={register}
                    errorsMessgae={errors.address?.message}
                  />
                </div>
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <div className=' mt-5 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          <div className='md:border-1 md:border-1-gray-200 flex justify-center sm:w-60 md:w-72'>
            <div className='flex flex-col items-center justify-center'>
              <div className='my-5 h-28 w-28'>
                {' '}
                {avatar ? (
                  <img
                    className='h-full w-full rounded-full object-cover'
                    src={previewImage === '' ? profile?.avatar : previewImage}
                    alt='anh'
                  />
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-full w-full rounded-full object-cover'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                    ></path>
                  </svg>
                )}
              </div>
              <InputFile onChange={onChangeFile} />
              <div className='my-4 text-xs text-gray-400'>
                <div>Dụng lượng file tối đa 1 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
