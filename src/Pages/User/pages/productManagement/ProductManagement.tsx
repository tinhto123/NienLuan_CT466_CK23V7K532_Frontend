import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import categoryAPI from 'src/api/category'
import productAPI from 'src/api/product.api'
import { productSchema } from 'src/utils/rules'
import { Product, ProductConfig } from 'src/types/product.type'
import InputNumber from 'src/components/InputButton/InputNumber'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface ProductFormData {
  name: string
  price: number
  price_before_discount: number
  quantity: number
  description: string
  category: string
}

export default function ProductManagement() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [image, setImage] = useState<File | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [description, setDescription] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesPreview, setImagesPreview] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(1)

  const queryConfig = useMemo(() => {
    const page = searchParams.get('page') || '1'
    return {
      page: page,
      limit: '10',
      sort_by: 'createdAt' as const,
      order: 'desc'
    } as ProductConfig
  }, [searchParams])

  const {
    register,
    handleSubmit: validateForm,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    mode: 'onSubmit'
  })

  useEffect(() => {
    categoryAPI
      .getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => setCategories([]))
    productAPI
      .getProducts(queryConfig)
      .then((res) => {
        setProducts(res.data.data.products)
        setPageSize(res.data.data.pagination.page_size)
      })
      .catch(() => setProducts([]))
  }, [queryConfig])

  useEffect(() => {
    if (editingProduct) {
      setValue('name', editingProduct.name)
      setValue('price', editingProduct.price)
      setValue('price_before_discount', editingProduct.price_before_discount)
      setValue('quantity', editingProduct.quantity)
      setValue('description', editingProduct.description)
      setValue('category', editingProduct.category?._id || '')
      setDescription(editingProduct.description)
      if (editingProduct.image) {
        setImagePreview(editingProduct.image)
        setImageUrl(editingProduct.image)
      }
      if (editingProduct.images && editingProduct.images.length > 0) {
        setImagesPreview(editingProduct.images)
        setImageUrls(editingProduct.images)
      } else {
        setImagesPreview([])
        setImageUrls([])
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [editingProduct, setValue])

  useEffect(() => {
    setValue('description', description)
  }, [description, setValue])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0]
      try {
        const response = await productAPI.uploadSingleImage(selectedImage)
        const uploadedImageUrl = response.data.data.imageUrl.replace(/\\/g, '/')
        setImagePreview(uploadedImageUrl)
        setImageUrl(uploadedImageUrl)
        setImage(selectedImage)
      } catch (error) {
        toast.error(t('error_upload_image') || 'Lỗi khi upload ảnh!')
      }
    }
  }

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      const localPreviews = newImages.map((file) => URL.createObjectURL(file))
      setImagesPreview((prev) => [...prev, ...localPreviews])
      setImages((prev) => [...prev, ...newImages])
      try {
        const response = await productAPI.uploadMultipleImages(newImages)
        const newServerUrls = response.data.data.imageUrls
        setImageUrls((prev) => [...prev, ...newServerUrls])
      } catch (error) {
        toast.error(t('error_upload_image') || 'Lỗi khi upload ảnh!')
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, idx) => idx !== index))
    setImagesPreview((prevPreviews) => prevPreviews.filter((_, idx) => idx !== index))
    setImageUrls((prevUrls) => prevUrls.filter((_, idx) => idx !== index))
  }

  const handleEnlargeImage = (imgUrl: string) => {
    setEnlargedImage(imgUrl)
  }

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null)
  }

  const handleSubmit = async (data: ProductFormData) => {
    if (!imageUrl && !imagePreview) {
      toast.error(t('main_image_required') || 'Vui lòng chọn ảnh chính cho sản phẩm!')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('price', data.price.toString())
      formData.append('price_before_discount', data.price_before_discount.toString())
      formData.append('quantity', data.quantity.toString())
      formData.append('description', data.description)
      formData.append('category', data.category)
      if (editingProduct) {
        if (imageUrl && imageUrl !== editingProduct.image) {
          formData.append('image', imageUrl)
        }
      } else {
        if (imageUrl) {
          formData.append('image', imageUrl)
        }
      }
      if (editingProduct) {
        if (imageUrls.length > 0 && JSON.stringify(imageUrls) !== JSON.stringify(editingProduct.images)) {
          imageUrls.forEach((url) => {
            formData.append('images', url)
          })
        }
      } else {
        if (imageUrls.length > 0) {
          imageUrls.forEach((url) => {
            formData.append('images', url)
          })
        }
      }
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formData)
        toast.success(t('update_product_success') || 'Cập nhật sản phẩm thành công!')
      } else {
        await productAPI.addProduct(formData)
        toast.success(t('add_product_success') || 'Thêm sản phẩm thành công!')
      }
      const updatedProducts = await productAPI.getProducts(queryConfig)
      setProducts(updatedProducts.data.data.products)
      reset({
        name: '',
        price: 0,
        price_before_discount: 0,
        quantity: 0,
        description: '',
        category: ''
      })
      setDescription('')
      setImage(null)
      setImages([])
      setImagePreview(null)
      setImagesPreview([])
      setImageUrl(null)
      setImageUrls([])
      setEditingProduct(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('error_submit') || 'Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm(t('confirm_delete') || 'Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productAPI.deleteProduct(id)
        toast.success(t('delete_product_success') || 'Xóa sản phẩm thành công!')
        setProducts((prev) => prev.filter((p) => p._id !== id))
      } catch (err: any) {
        toast.error(err?.response?.data?.message || t('error_delete') || 'Có lỗi xảy ra khi xóa sản phẩm!')
      }
    }
  }

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['clean']
      ]
    }),
    []
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image'
  ]

  return (
    <div className='w-full rounded bg-white p-6 shadow'>
      <h2 className='text-orange-600 mb-6 text-center text-2xl font-bold'>
        {editingProduct ? t('update_product') : t('add_new_product')}
      </h2>
      <form onSubmit={validateForm(handleSubmit)} className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='w-full'>
            <label htmlFor='name' className='mb-1 block font-semibold'>
              {t('product_name')}
            </label>
            <input
              id='name'
              type='text'
              className='focus:border-orange-500 w-full rounded border px-3 py-2 focus:outline-none'
              placeholder={t('enter_product_name')}
              {...register('name')}
            />
            {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
          </div>

          <div className='w-full'>
            <label htmlFor='price' className='mb-1 block font-semibold'>
              {t('price')}
            </label>
            <Controller
              control={control}
              name='price'
              render={({ field }) => (
                <InputNumber
                  id='price'
                  classNameInput='focus:border-orange-500 w-full rounded border px-3 py-2 focus:outline-none'
                  placeholder={t('enter_price')}
                  errorMessage={errors.price?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className='w-full'>
            <label htmlFor='price_before_discount' className='mb-1 block font-semibold'>
              {t('price_before_discount')}
            </label>
            <Controller
              control={control}
              name='price_before_discount'
              render={({ field }) => (
                <InputNumber
                  id='price_before_discount'
                  classNameInput='focus:border-orange-500 w-full rounded border px-3 py-2 focus:outline-none'
                  placeholder={t('enter_price_before_discount')}
                  errorMessage={errors.price_before_discount?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className='w-full'>
            <label htmlFor='quantity' className='mb-1 block font-semibold'>
              {t('quantity')}
            </label>
            <input
              id='quantity'
              type='number'
              className='focus:border-orange-500 w-full rounded border px-3 py-2 focus:outline-none'
              placeholder={t('enter_quantity')}
              {...register('quantity')}
            />
            {errors.quantity && <p className='mt-1 text-sm text-red-600'>{errors.quantity.message}</p>}
          </div>

          <div className='w-full'>
            <label htmlFor='category' className='mb-1 block font-semibold'>
              {t('category')}
            </label>
            <select
              id='category'
              className='focus:border-orange-500 w-full rounded border px-3 py-2 focus:outline-none'
              {...register('category')}
            >
              <option value=''>{t('select_category')}</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && <p className='mt-1 text-sm text-red-600'>{errors.category.message}</p>}
          </div>

          <div className='w-full md:col-span-2'>
            <label htmlFor='description' className='mb-1 block font-semibold'>
              {t('description')}
            </label>
            <ReactQuill
              theme='snow'
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              className='h-64'
            />
            {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
          </div>

          <div className='w-full pt-10'>
            <label htmlFor='main-image' className='mb-1 block font-semibold'>
              {t('main_image')}
            </label>
            <input
              id='main-image'
              type='file'
              accept='image/*'
              className='file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold'
              onChange={handleImageChange}
            />
            {imageUrl && (
              <p className='mt-1 text-xs text-gray-500'>
                {t('image_path')}: {imageUrl}
              </p>
            )}
            {(image || imagePreview) && (
              <button
                type='button'
                className='mt-2 block rounded border p-0'
                onClick={() => handleEnlargeImage(image ? URL.createObjectURL(image) : (imagePreview as string))}
                tabIndex={0}
                style={{ background: 'none', border: 'none' }}
              >
                <img
                  src={image ? URL.createObjectURL(image) : (imagePreview as string)}
                  alt='preview'
                  className='h-24 object-contain hover:opacity-80'
                  draggable={false}
                />
              </button>
            )}
          </div>

          <div className='w-full pt-10'>
            <label htmlFor='secondary-images' className='mb-1 block font-semibold'>
              {t('secondary_images')}
            </label>
            <input
              id='secondary-images'
              type='file'
              accept='image/*'
              multiple
              className='file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold'
              onChange={handleImagesChange}
            />
            {imageUrls.length > 0 && (
              <p className='mt-1 text-xs text-gray-500'>
                {t('image_path')}: {imageUrls.join(', ')}
              </p>
            )}
            {imagesPreview.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {imagesPreview.map((imgUrl, idx) => (
                  <div key={idx} className='relative'>
                    <button
                      type='button'
                      className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'
                      onClick={() => handleRemoveImage(idx)}
                    >
                      ×
                    </button>
                    <button
                      type='button'
                      className='mt-2 block rounded border p-0'
                      onClick={() => handleEnlargeImage(imgUrl)}
                      tabIndex={0}
                      style={{ background: 'none', border: 'none' }}
                    >
                      <img
                        src={imgUrl}
                        alt={`preview-${idx}`}
                        className='h-16 w-16 object-contain hover:opacity-80'
                        draggable={false}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            type='submit'
            className='hover:bg-orange-600 mt-4 rounded bg-orange px-4 py-2 font-semibold text-white transition'
            disabled={loading}
          >
            {loading ? t('processing') : editingProduct ? t('update_product') : t('add_new_product')}
          </button>

          {editingProduct && (
            <button
              type='button'
              className='mt-4 rounded bg-gray-500 px-4 py-2 font-semibold text-white transition hover:bg-gray-600'
              onClick={() => {
                setEditingProduct(null)
                reset({
                  name: '',
                  price: 0,
                  price_before_discount: 0,
                  quantity: 0,
                  description: '',
                  category: ''
                })
                setDescription('')
                setImagePreview(null)
                setImagesPreview([])
                setImageUrl(null)
                setImageUrls([])
              }}
            >
              {t('cancel')}
            </button>
          )}
        </div>
      </form>

      {/* Modal hiển thị ảnh phóng to */}
      {enlargedImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
          onClick={handleCloseEnlargedImage}
          tabIndex={0}
          role='button'
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleCloseEnlargedImage()
          }}
        >
          <div className='relative max-h-[90vh] max-w-[90vw]'>
            <img src={enlargedImage} alt='Enlarged preview' className='max-h-[90vh] max-w-[90vw] object-contain' />
            <button
              className='absolute -right-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-bold text-black'
              onClick={handleCloseEnlargedImage}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className='mt-10 rounded bg-white p-4 shadow'>
        <h3 className='text-orange-600 mb-4 text-lg font-bold'>{t('product_list')}</h3>
        {products.length === 0 ? (
          <div className='text-center text-gray-500'>{t('no_products')}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2'>STT</th>
                  <th className='px-4 py-2'>{t('product_name')}</th>
                  <th className='px-4 py-2'>{t('price')}</th>
                  <th className='px-4 py-2'>{t('category')}</th>
                  <th className='px-4 py-2'>{t('main_image')}</th>
                  <th className='px-4 py-2'>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => {
                  const currentPage = Number(searchParams.get('page')) || 1
                  const startIndex = (currentPage - 1) * 10
                  return (
                    <tr key={product._id} className='border-b hover:bg-gray-50'>
                      <td className='px-4 py-2'>{startIndex + idx + 1}</td>
                      <td className='px-4 py-2'>{product.name}</td>
                      <td className='px-4 py-2'>{product.price.toLocaleString()}₫</td>
                      <td className='px-4 py-2'>{product.category?.name || ''}</td>
                      <td className='px-4 py-2'>
                        {product.image && (
                          <img
                            src={`${product.image}`}
                            alt={product.name}
                            className='h-12 w-12 rounded border object-contain'
                          />
                        )}
                      </td>
                      <td className='flex items-center justify-center gap-2 px-4 py-2'>
                        <button
                          type='button'
                          title={t('edit')}
                          onClick={() => setEditingProduct(product)}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          <i className='fa fa-pencil' style={{ fontSize: '1.2rem' }} aria-hidden='true'></i>
                        </button>
                        <button
                          type='button'
                          title={t('delete')}
                          onClick={() => handleDeleteProduct(product._id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <i className='fa fa-trash' style={{ fontSize: '1.2rem' }} aria-hidden='true'></i>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className='mt-4 flex justify-center'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => {
                    const currentPage = Number(searchParams.get('page')) || 1
                    if (currentPage > 1) {
                      setSearchParams({ page: String(currentPage - 1) })
                    }
                  }}
                  disabled={Number(searchParams.get('page')) <= 1}
                  className='rounded border px-3 py-1 disabled:bg-gray-100 disabled:text-gray-400'
                >
                  {t('prev_page') || 'Trang trước'}
                </button>
                <span className='mx-2'>
                  {t('page')} {searchParams.get('page') || '1'} / {pageSize}
                </span>
                <button
                  onClick={() => {
                    const currentPage = Number(searchParams.get('page')) || 1
                    if (currentPage < pageSize) {
                      setSearchParams({ page: String(currentPage + 1) })
                    }
                  }}
                  disabled={Number(searchParams.get('page')) >= pageSize}
                  className='rounded border px-3 py-1 disabled:bg-gray-100 disabled:text-gray-400'
                >
                  {t('next_page') || 'Trang sau'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
