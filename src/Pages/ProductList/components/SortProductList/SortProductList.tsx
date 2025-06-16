import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import classNames from 'classnames'
import { order as orderBy, sortBy } from 'src/constants/product'
import { ProductConfig } from 'src/types/product.type'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { t } = useTranslation()
  const { sort_by = sortBy.createdAt } = queryConfig
  const { order = orderBy.desc } = queryConfig
  const navigate = useNavigate()
  function isSortBy(sortByValue: Exclude<ProductConfig['sort_by'], undefined>) {
    return sort_by === sortByValue
  }
  const handleSort = (sortByValue: Exclude<ProductConfig['sort_by'], undefined>) => {
    navigate(
      omit(
        {
          pathname: path.home,
          search: createSearchParams({
            ...queryConfig,
            sort_by: sortByValue
          }).toString()
        },
        ['order']
      )
    )
  }
  const handleBySelect = (sortByValue: Exclude<ProductConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: sortByValue
      }).toString()
    })
  }
  const page = Number(queryConfig.page)
  return (
    <div className='flex justify-between bg-gray-300 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-start gap-2 md:justify-start '>
        <div>{t('sort_by')}</div>
        <Button
          className={classNames('h-8 px-4 text-sm capitalize ', {
            'bg-orange text-white  hover:bg-orange/90': isSortBy(sortBy.view),
            'bg-white text-black hover:bg-gray-100': !isSortBy(sortBy.view)
          })}
          onClick={() => handleSort('view')}
        >
          {t('popular')}
        </Button>
        <Button
          className={classNames('h-8 px-4 text-sm capitalize ', {
            'bg-orange text-white  hover:bg-orange/90': isSortBy(sortBy.createdAt),
            'bg-white text-black hover:bg-gray-100': !isSortBy(sortBy.createdAt)
          })}
          onClick={() => handleSort('createdAt')}
        >
          {t('latest')}
        </Button>
        <Button
          className={classNames('h-8 px-4 text-sm capitalize ', {
            'bg-orange text-white  hover:bg-orange/90': isSortBy(sortBy.sold),
            'bg-white text-black hover:bg-gray-100': !isSortBy(sortBy.sold)
          })}
          onClick={() => handleSort('sold')}
        >
          {t('top_sales')}
        </Button>
        <select
          value={order || ''}
          onChange={(e) => handleBySelect(e.target.value as Exclude<ProductConfig['order'], undefined>)}
          className={classNames('h-8 px-4 text-left text-sm  capitalize  outline-none', {
            'bg-orange text-white hover:bg-orange/60': isSortBy(sortBy.price),
            'bg-white text-black outline-none hover:bg-slate-100': !isSortBy(sortBy.price)
          })}
        >
          <option disabled className='bg-white capitalize text-black ' value={order || ''}>
            {t('price')}
          </option>
          <option value={orderBy.asc} className='bg-white capitalize text-black'>
            {t('price_low_to_high')}
          </option>
          <option value={orderBy.desc} className='bg-white capitalize text-black'>
            {t('price_high_to_low')}
          </option>
        </select>
      </div>
      <div className='flex items-center'>
        <span className='text-orange'>{page}</span>
        <span className='text-black'>/{pageSize}</span>
        <div className='ml-2 flex'>
          {page === 1 ? (
            <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white/60 shadow hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </span>
          ) : (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
              className='flex h-8 w-9  items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </Link>
          )}
          {page === pageSize ? (
            <span className='cursor-not- flex h-8 w-9 items-center justify-center rounded-bl-sm rounded-tl-sm  bg-white/60 shadow hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </span>
          ) : (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
              className='flex h-8 w-9 items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
