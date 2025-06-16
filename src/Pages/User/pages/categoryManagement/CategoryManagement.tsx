import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import categoryAPI from 'src/api/category'
import { category } from 'src/types/product.type'
import { useTranslation } from 'react-i18next'

export default function CategoryManagement() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<category[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryAPI.getCategories()
      setCategories(response.data.data)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể tải danh sách loại sản phẩm!')
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleAddOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error(t('category_name') + ' không được để trống!')
      return
    }
    setLoading(true)
    try {
      if (editingCategory) {
        // Cập nhật loại sản phẩm
        const response = await categoryAPI.updateCategory(editingCategory.id, { name })
        toast.success(response.data.message || t('update_category') + ' thành công!')
        setEditingCategory(null)
      } else {
        // Thêm loại sản phẩm mới
        const response = await categoryAPI.addCategory({ name })
        toast.success(response.data.message || t('add_new_category') + ' thành công!')
      }
      setName('')
      fetchCategories() // Refresh danh sách sau khi thêm/cập nhật
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra!')
      if (err?.response?.status === 403) {
        toast.error(err?.response?.data?.message || 'Chỉ admin mới có quyền thực hiện thao tác này!')
      }
    } finally {
      setLoading(false)
    }
  }

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const handleDeleteCategory = async (id: string) => {
    setCategoryToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      const response = await categoryAPI.deleteCategory(categoryToDelete)
      toast.success(response.data.message || t('delete') + ' thành công!')
      fetchCategories() // Refresh danh sách sau khi xóa
      setShowDeleteDialog(false)
      setCategoryToDelete(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi xóa loại sản phẩm!')
      if (err?.response?.status === 403) {
        toast.error(err?.response?.data?.message || 'Chỉ admin mới có quyền xóa loại sản phẩm!')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteDialog(false)
    setCategoryToDelete(null)
  }

  const handleEditCategory = (id: string, currentName: string) => {
    setEditingCategory({ id, name: currentName })
    setName(currentName)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setName('')
  }

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>{t('category_management_title')}</h1>

      {/* Form thêm/cập nhật loại sản phẩm */}
      <div className='mb-8 rounded bg-white p-6 shadow'>
        <h2 className='mb-4 text-lg font-semibold text-orange'>
          {editingCategory ? t('update_category') : t('add_new_category')}
        </h2>
        <form onSubmit={handleAddOrUpdateCategory} className='flex gap-4'>
          <input
            type='text'
            className='flex-grow rounded border px-3 py-2 focus:border-orange focus:outline-none'
            placeholder={t('enter_category_name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className='flex gap-2'>
            <button
              type='submit'
              className='rounded bg-orange px-4 py-2 font-semibold text-white transition hover:bg-orange/90'
              disabled={loading}
            >
              {loading ? t('processing') : editingCategory ? t('update') : t('add')}
            </button>
            {editingCategory && (
              <button
                type='button'
                onClick={handleCancelEdit}
                className='rounded bg-gray-500 px-4 py-2 font-semibold text-white transition hover:bg-gray-600'
              >
                {t('cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bảng danh sách loại sản phẩm */}
      <div className='rounded bg-white p-6 shadow'>
        <h2 className='mb-4 text-lg font-semibold text-orange'>{t('category_list')}</h2>

        {categories.length === 0 ? (
          <div className='py-4 text-center text-gray-500'>{t('no_categories')}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2 text-left'>STT</th>
                  <th className='px-4 py-2 text-left'>{t('category_name')}</th>
                  <th className='px-4 py-2 text-center'>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-3'>{index + 1}</td>
                    <td className='px-4 py-3'>{category.name}</td>
                    <td className='px-4 py-3 text-center'>
                      <div className='flex justify-center gap-2'>
                        <button
                          onClick={() => handleEditCategory(category._id, category.name)}
                          className='rounded bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600'
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          disabled={isDeleting}
                          className='rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600'
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog xác nhận xóa */}
      {showDeleteDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>{t('confirm_delete')}</h3>
            <p className='mb-6'>{t('confirm_delete_message')}</p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={cancelDelete}
                className='rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600'
                disabled={isDeleting}
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className='rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600'
                disabled={isDeleting}
              >
                {isDeleting ? t('processing') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
