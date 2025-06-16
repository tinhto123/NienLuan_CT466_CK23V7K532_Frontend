import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating/ProductRating'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'

interface PropsProduct {
  product: ProductType
}
export default function Product({ product }: PropsProduct) {
  const { t } = useTranslation()
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`} className='decoration-inherit'>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img className='absolute left-0 top-0 h-full w-full bg-white object-cover' src={product.image} alt='anh' />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex flex-col items-center sm:flex-row'>
            <div className='truncate text-gray-500 line-through sm:max-w-[50%]'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <div className='flex items-center'>
              <ProductRating
                rating={product.rating}
                activeClassname='fill-orange text-orange h-3 w-3'
                nonActiveClassname='fill-gray-300 text-gray-300 h-3 w-3'
              />
              <div className='ml-2 text-xs sm:text-sm'>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1'>{t('sold')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
