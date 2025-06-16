import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import productAPI from 'src/api/product.api'
import { formatCurrency, getIdFromNameId } from '../../utils/utils'
import { Product as ProductType, ProductConfig } from 'src/types/product.type'
import Product from '../ProductList/components/Product'
import ProductRating from 'src/components/ProductRating/ProductRating'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import InputControler from 'src/components/InputController'
import purchaseApi from 'src/api/purchase.api'
import { toast } from 'react-toastify'
import { purchasesStatus } from 'src/constants/purchase'
import path from 'src/constants/path'
import PageNotFound from '../NotFound'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetail } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => {
      return productAPI.getProductDetail(String(id))
    }
  })
  const product = productDetail?.data.data

  const queryConfig: ProductConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productData, isLoading } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productAPI.getProducts(queryConfig)
    }
  })
  const products = productData?.data.data.products
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState<string>('')
  const imageRef = useRef<HTMLImageElement>(null)
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product && product.images.length > 0) {
      const objToArray = Object.keys(product.images).map((key: any) => product.images[key])
      setActiveImage(objToArray[0])
    }
  }, [product])

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }
  const next = () => {
    if (currentIndexImages[1] < (product as ProductType)?.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }
  const [buyCount, setBuyCount] = useState(1)

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }
  const addToCartMutation = useMutation(purchaseApi.addToCart)
  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (success) => {
          toast.success(success.data.message, { autoClose: 2000 }),
            queryClient.invalidateQueries(['purchase', purchasesStatus.inCart])
        }
      }
    )
  }
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        state: {
          purchaseId: purchase._id
        }
      }
    })
  }
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    const { offsetX, offsetY } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }
  if (product === undefined && isLoading === false) {
    return <PageNotFound />
  }

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-2 lg:gap-9'>
            <div className='col-span-12 md:col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseLeave={handleRemoveZoom}
                onMouseMove={handleZoom}
              >
                <img
                  className='pointer-events-none absolute left-0 top-0 h-full w-full bg-white object-cover'
                  src={activeImage}
                  alt={product?.name}
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='let-0 absolute top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/40 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>

                {currentImages?.map((image) => {
                  const isActive = image == activeImage
                  return (
                    <div
                      className='relative w-full cursor-pointer pt-[100%]'
                      onMouseEnter={() => chooseActive(image)}
                      key={image}
                    >
                      <img
                        src={image}
                        alt={product?.name}
                        className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className={'absolute inset-0 border-2 border-orange'}></div>}
                    </div>
                  )
                })}

                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>

            <div className='col-span-12 md:col-span-7'>
              <h1 className='text-lg font-medium uppercase sm:text-xl' aria-hidden>
                {product?.name}
              </h1>
              <div className='mt-8 flex items-center'>
                {product?.rating === 0 ? (
                  <span className='text-gray-500'>Chưa có đánh giá</span>
                ) : (
                  <div className='flex'>
                    <span className='mr-1 border-b border-b-orange text-orange'>{product?.rating}</span>
                    <ProductRating
                      rating={Number(product?.rating)}
                      activeClassname='fill-orange text-orange h-4 w-4'
                      nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                    />
                  </div>
                )}
              </div>
              <div className='mt-8  flex flex-col items-center bg-gray-50 px-5 py-4 md:flex-row'>
                <div className='text-gray-500 line-through'>
                  ₫{formatCurrency(Number(product?.price_before_discount))}
                </div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(Number(product?.price))}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  Giảm 20%
                </div>
              </div>
              <div className='mt-8 flex  flex-col items-center md:flex-row'>
                <div className='text-gray- py-1 capitalize'>Số lượng</div>
                <div className=' flex items-center py-2'>
                  <InputControler
                    onDecrease={handleBuyCount}
                    onIncrease={handleBuyCount}
                    onType={handleBuyCount}
                    value={buyCount}
                    max={product?.quantity}
                  />
                </div>

                <div className='ml-6 text-sm text-gray-500'>{product?.quantity} Sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 p-4 text-sm capitalize text-orange'
                  onClick={addToCart}
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  thêm vào giỏ hàng
                </button>
                <button
                  className='ml-5 h-12 rounded-sm bg-orange p-4 text-sm capitalize text-white hover:bg-orange/90'
                  onClick={buyNow}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='bg-white p-4 shadow-sm'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mb-4 mt-12 text-sm leading-loose'>
              {/* <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.data.data.discription as string)
                }}
              /> */}
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description as string)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>có thể bạn cũng thích</div>
          <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {products?.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
