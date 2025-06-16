import { Link } from 'react-router-dom'
import { formatCurrency, generateNameId } from '../../utils/utils'
import path from 'src/constants/path'

interface Props {
  id: string
  image: string
  name: string
  price: number
  price_before_discount: number
  quantitys: number
  checked: boolean
  disable: boolean
  index: number
  // handleQuantity: (purchaseIndex: number, value: number) => void
  onChaneChecked: (id: string) => void
}
export default function CartItem({
  id,
  image,
  name,
  price,
  price_before_discount,
  checked,
  index,
  onChaneChecked
}: Props) {
  return (
    <div className='mb-5  grid grid-cols-12 items-center rounded-sm border border-gray-200 px-4   py-5 text-center text-gray-500 first:mt-0'>
      <div className='col-span-6'>
        <div className='flex'>
          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
            <input
              type='checkbox'
              checked={checked}
              className='h-5 w-5 accent-orange'
              onChange={() => onChaneChecked(String(index))}
            />
          </div>
          <div className='flex flex-grow'>
            <div className='flex'>
              <Link to={`${path.home}${generateNameId({ name: name, id: id })}`} className='h-20 w-20 flex-shrink-0'>
                <img src={image} alt={name} />
              </Link>
              <div className='flex-grow px-2 pb-2 pt-1'>
                <Link to={''} className='line-clamp-2 text-left'>
                  {name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-2'>
        <div className='flex items-center justify-center'>
          <span className='text-gray-300 line-through'>₫{formatCurrency(price_before_discount)}</span>
          <div className='ml-3 '>₫{formatCurrency(price)}</div>
        </div>
      </div>
      <div className='col-span-2'>
        <div className='flex items-center justify-center'>
          {/* <InputControler
            increase={increase}
            quantity={quantity}
            prevnumber={prevnumber}
            setQuantity={setQuantity}
            maxQuantity={12}
            handleQuantity={handleQuantity(index, 10)}
          /> */}
        </div>
      </div>
      <div className='col-span-1'>
        <span className='text-orange'>₫{formatCurrency(price)}</span>
      </div>
      <div className='col-span-1'>
        <span className='cursor-pointer bg-none text-black hover:text-orange'>Xóa</span>
      </div>
    </div>
  )
}
