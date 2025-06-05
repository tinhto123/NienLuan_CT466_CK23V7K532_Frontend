import { Link, createSearchParams } from 'react-router-dom'
import { category } from '../../../../types/product.type'
import path from 'src/constants/path'
import classNames from 'classnames'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  category: category[]
}
export default function AsideFitter({ queryConfig, category }: Props) {
  const { t } = useTranslation()
  const { category: categories = 'all' } = queryConfig
  function isActive(id: string) {
    return id === categories
  }
  return (
    <div>
      <Link
        to={'/'}
        className={classNames('flex items-center justify-start font-bold', {
          ' text-orange ': isActive('all'),
          'text-black': !isActive('all')
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('all categories')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <ul>
        {category.map((category) => (
          <li key={category._id} className='py-2 pl-2'>
            <Link
              className={classNames('px- relative flex items-center justify-start', {
                'text-orange': isActive(category._id),
                'text-black': !isActive(category._id)
              })}
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: category._id
                }).toString()
              }}
            >
              {isActive(category._id) ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z'
                  />
                </svg>
              ) : (
                ''
              )}
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
