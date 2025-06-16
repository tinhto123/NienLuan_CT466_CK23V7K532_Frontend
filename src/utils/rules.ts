import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 kí tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },

    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 kí tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 kí tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập password là bắt buộc'
    },

    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 kí tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 kí tự'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues('password') || 'Mật khẩu không khớp' : undefined
  }
})
const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 kí tự')
    .max(160, 'Độ dài từ 5 - 160 kí tự'),
  password: yup
    .string()
    .required('Password là bắt buộc ')
    .min(6, 'Độ dài từ 6 - 150 kí tự')
    .max(160, 'Độ dài từ 6 - 150 kí tự'),
  confirm_password: handleConfirmPasswordYup('password'),

  price_min: yup
    .string()
    .required('Nhập vào giá')
    .test({
      name: 'price not allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_min = value
        const { price_max } = this.parent as { price_min: string; price_max: string }
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_min !== '' || price_max !== ''
      }
    }),
  price_max: yup
    .string()
    .required('Nhập vào giá')
    .test({
      name: 'price not allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_max = value
        const { price_min } = this.parent as { price_min: string; price_max: string }
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_min !== '' || price_max !== ''
      }
    }),
  name: yup.string().trim().required('Nhập vào tên sản phẩm')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password')
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>

export const productSchema = yup.object({
  name: yup.string().required('Tên sản phẩm không được để trống!'),
  price: yup
    .number()
    .typeError('Giá sản phẩm phải là số!')
    .required('Giá sản phẩm không được để trống!')
    .positive('Giá sản phẩm phải lớn hơn 0!')
    .test('price-less-than-discount', 'Giá sản phẩm phải nhỏ hơn giá trước khi giảm!', function (value) {
      const { price_before_discount } = this.parent
      return !price_before_discount || value < price_before_discount
    }),
  price_before_discount: yup
    .number()
    .typeError('Giá trước khi giảm phải là số!')
    .min(0, 'Giá trước khi giảm không được âm!')
    .required('Giá trước khi giảm không được để trống!'),
  quantity: yup
    .number()
    .typeError('Số lượng phải là số!')
    .required('Số lượng không được để trống!')
    .integer('Số lượng phải là số nguyên!')
    .min(0, 'Số lượng không được âm!'),
  description: yup.string().required('Mô tả sản phẩm không được để trống!'),
  category: yup.string().required('Vui lòng chọn loại sản phẩm!')
})

export const changePasswordSchema = yup.object({
  password: yup.string().required('Vui lòng nhập mật khẩu cũ'),
  new_password: yup.string().required('Vui lòng nhập mật khẩu mới').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirm_password: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('new_password')], 'Mật khẩu không khớp')
})
