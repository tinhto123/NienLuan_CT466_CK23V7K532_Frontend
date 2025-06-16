import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputButton'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import path from 'src/constants/path'
import { NoUndefinedField } from 'src/utils/utils'
import RatingSort from '../RatingSort'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
}
type FormData = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function SortFitter({ queryConfig }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema)
  })
  const hanldSubmit = handleSubmit((data) => {
    const price_max = data.price_max as string
    const price_min = data.price_min as string
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: price_min,
        price_max: price_max
      }).toString()
    })
  })

  const clearAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['category', 'exclude', 'limit', 'name', 'order', 'price_max', 'price_min', 'rating_filter', 'sort_by']
        )
      ).toString()
    })
  }
  return (
    <div>
      <Link to={'/'} className='mt-2 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('filters')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div>{t('price_range')}</div>
        <div className='mt-2 flex items-start justify-start '>
          <Controller
            control={control}
            name='price_min'
            render={({ field }) => {
              return (
                <InputNumber
                  classNameInput='w-full rounded border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  name='from'
                  type='text'
                  className='grow'
                  placeholder={t('price from')}
                  classNameError='hidden'
                  onChange={(event) => {
                    field.onChange(event), trigger('price_max')
                  }}
                />
              )
            }}
          />
          {/* <InputNumber
            classNameInput='w-full rounded border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
            name='from'
            type='text'
            className='grow'
            placeholder='₫ TỪ'
            classNameError='hidden'
          /> */}
          <div className='mx-2 mt-1 shrink-0'>-</div>

          <Controller
            control={control}
            name='price_max'
            render={({ field }) => {
              return (
                <InputNumber
                  classNameInput='w-full rounded border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  name='to'
                  type='text'
                  className='grow '
                  classNameError='hidden'
                  placeholder={t('price to')}
                  onChange={(event) => {
                    field.onChange(event), trigger('price_min')
                  }}
                />
              )
            }}
          />
        </div>
        <div className='mt-1 min-h-[1rem] text-center text-sm text-red-600'>
          {errors.price_min?.message ? errors.price_min.message : errors.price_max?.message}
        </div>
        <Button
          className='mt-5 flex w-full items-center justify-center rounded bg-orange p-3 text-white hover:bg-orange/90'
          onClick={hanldSubmit}
        >
          {t('apply')}
        </Button>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div className='text-sm'>{t('review')}</div>
        <RatingSort queryConfig={queryConfig} />
      </div>
      <Button
        onClick={clearAll}
        className='mt-5 flex w-full items-center justify-center rounded bg-orange p-3 text-white hover:bg-orange/90'
      >
        {t('btn_clear')}
      </Button>
    </div>
  )
}
