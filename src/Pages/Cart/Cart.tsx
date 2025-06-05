import { useMutation, useQuery } from '@tanstack/react-query'
import purchaseApi from 'src/api/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { Purchase } from '../../types/purchase.type'
import { useEffect, useMemo, useContext } from 'react'
import { produce } from 'immer'
import { Link, useLocation } from 'react-router-dom'
import path from 'src/constants/path'
import { convertNegativeToPositive, formatCurrency, generateNameId } from 'src/utils/utils'
import InputControler from 'src/components/InputController'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { AppContext } from 'src/context/app.context'

export default function Cart() {
  const location = useLocation()
  const { extendsPurchase, setExtendsPurchase } = useContext(AppContext)
  const isAllChecked = useMemo(() => extendsPurchase.every((purchase) => purchase.checked), [extendsPurchase])
  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: ['purchase', purchasesStatus.inCart],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const productInCart = useMemo(() => purchaseInCartData?.data.data, [purchaseInCartData])
  const PurchaseChecked = extendsPurchase.filter((p) => p.checked)
  const getPurchaseIdFromProductDetail = useMemo(
    () => (location?.state?.state as { purchaseId: string } | null)?.purchaseId as string,
    [location]
  )
  const PriceAfterDiscount = PurchaseChecked.reduce(
    (accumulator, currentValue) => Number(accumulator) + currentValue.price * currentValue.buy_count,
    0
  )
  const thriftyPrice = PurchaseChecked.reduce(
    (accumulator, currentValue) =>
      Number(accumulator) + (currentValue.price - currentValue.price_before_discount) * currentValue.buy_count,
    0
  )
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: (data: { purchaseIds: string[] }) => purchaseApi.deletePurchases(data),
    onSuccess: () => {
      toast.success('Xóa thành công')
      refetch()
    }
  })
  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: () => {
      toast.success('Mua hàng thành công')
      refetch()
    }
  })

  useEffect(() => {
    setExtendsPurchase((prev) => {
      const extendedPurchaseObj = keyBy(prev, '_id')
      return (
        productInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = getPurchaseIdFromProductDetail === purchase._id
          return {
            ...purchase,
            disable: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchaseObj[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [productInCart, getPurchaseIdFromProductDetail, setExtendsPurchase])
  useEffect(() => {
    return () => history.replaceState(null, '')
  }, [])
  const handleCheck = (purchaseIndex: string) => {
    setExtendsPurchase(
      produce((purchase) => {
        purchase[Number(purchaseIndex)].checked = !purchase[Number(purchaseIndex)].checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendsPurchase((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendsPurchase(
      produce((purchase) => {
        purchase[purchaseIndex].buy_count = value
      })
    )
  }
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendsPurchase[purchaseIndex]
      setExtendsPurchase(
        produce((purchase) => {
          purchase[purchaseIndex].disable = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const handleMutation = (purchase_id: number) => () => {
    const product_id = extendsPurchase[purchase_id]._id
    deletePurchaseMutation.mutate({ purchaseIds: [product_id] })
  }
  const handleDeleteManyPurchase = () => {
    const purchaseIds = PurchaseChecked.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate({ purchaseIds })
  }
  const buyPurchases = () => {
    buyPurchaseMutation.mutate(PurchaseChecked)
  }

  return (
    <div className='bg-neutral-100 py-16'>
      {extendsPurchase.length > 0 ? (
        <div className='container'>
          <div className='overflow-auto'>
            <div className='min-w-[1000px]'>
              <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                <div className='col-span-6'>
                  <div className='flex items-center'>
                    <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 accent-orange'
                        checked={isAllChecked}
                        onChange={handleCheckAll}
                      />
                    </div>
                    <div className='flex-grow capitalize text-black'>sản phẩm</div>
                  </div>
                </div>
                <div className='col-span-6'>
                  <div className='grid grid-cols-5 text-center'>
                    <div className='col-span-2'>Đơn giá</div>
                    <div className='col-span-1'>Số lượng</div>
                    <div className='col-span-1'>Số tiền</div>
                    <div className='col-span-1'>Thao tác</div>
                  </div>
                </div>
              </div>
              <div className='my-3 rounded-sm bg-white p-5  text-sm shadow'>
                {extendsPurchase?.map((product, index) => (
                  <div
                    key={product.product._id}
                    className='mb-5  grid grid-cols-12 items-center rounded-sm border border-gray-200 px-4   py-5 text-center text-gray-500 first:mt-0'
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                          <input
                            type='checkbox'
                            checked={product.checked}
                            className='h-5 w-5 accent-orange'
                            onChange={() => handleCheck(String(index))}
                          />
                        </div>
                        <div className='flex flex-grow'>
                          <div className='flex'>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: product.product.name,
                                id: product.product._id
                              })}`}
                              className='h-20 w-20 flex-shrink-0'
                            >
                              <img src={product.product.image} alt={product.product.name} />
                            </Link>
                            <div className='flex-grow px-2 pb-2 pt-1'>
                              <Link to={''} className='line-clamp-2 text-left'>
                                {product.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <div className='flex items-center justify-center'>
                        <span className='text-gray-300 line-through'>
                          ₫{formatCurrency(product.product.price_before_discount)}
                        </span>
                        <div className='ml-3 '>₫{formatCurrency(product.product.price)}</div>
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <div className='flex items-center justify-center'>
                        <InputControler
                          value={product.buy_count}
                          max={product.product.quantity}
                          classNameWrapper='flex items-center'
                          onIncrease={(value) => handleQuantity(index, value, value <= product.product.quantity)}
                          onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                          disabled={product.disable}
                          onType={handleTypeQuantity(index)}
                          onFocusOut={(value) => {
                            handleQuantity(
                              index,
                              Number(value),
                              Number(value) >= 1 &&
                                Number(value) <= product.product.quantity &&
                                Number(value) !== (productInCart as Purchase[])[index].buy_count
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-span-1'>
                      <span className='text-orange'>₫{formatCurrency(product.buy_count * product.product.price)}</span>
                    </div>
                    <div className='col-span-1'>
                      <button
                        className='cursor-pointer bg-none text-black hover:text-orange'
                        onClick={handleMutation(index)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
            <div className='flex items-center'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input
                  type='checkbox'
                  className='h-5 w-5 accent-orange'
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                />
              </div>
              <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
                Chọn tất cả ({extendsPurchase.length})
              </button>
              <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchase}>
                Xóa
              </button>
            </div>
            <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
              <div>
                <div className='flex items-center sm:justify-end'>
                  <div>Tổng thanh toán ({PurchaseChecked.length} sản phẩm):</div>
                  <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(PriceAfterDiscount)}</div>
                </div>
                <div className='flex items-center text-sm sm:justify-end'>
                  <div className='text-gray-500'>Tiết kiệm</div>
                  <div className='ml-6 text-orange'>₫{convertNegativeToPositive(formatCurrency(thriftyPrice))}</div>
                </div>
              </div>
              <button
                disabled={buyPurchaseMutation.isLoading}
                className={classNames(
                  'mt-5 flex h-10 w-52 items-center justify-center  text-sm uppercase text-white  sm:ml-4 sm:mt-0',
                  {
                    'bg-red-500 hover:bg-red-600': PurchaseChecked.length > 0,
                    'cursor-not-allowed bg-gray-500': PurchaseChecked.length === 0
                  }
                )}
                onClick={buyPurchases}
              >
                <span>Mua hàng</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='container'>
          {' '}
          <div className='flex flex-col items-center justify-center rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
            <img className='h-24 w-24' src='/assets/cart_emty.jpg' alt='anh' />
            <div className='mt-5 font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5'>
              <Link to={'/'} className=' rounded-sm bg-orange px-4 py-2 text-white'>
                Mua Ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
