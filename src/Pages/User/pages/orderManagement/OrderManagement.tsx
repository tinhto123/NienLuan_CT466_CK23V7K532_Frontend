import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import orderApi from 'src/api/order.api'
import { formatCurrency } from 'src/utils/utils'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

const orderTabs = [
  { status: 'all', name: 'all' },
  { status: 0, name: 'waiting_for_confirmation' },
  { status: 1, name: 'received' }
]

export default function OrderManagement() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<string | number>('all')
  const { data } = useQuery(['orders', tab], () =>
    tab === 'all' ? orderApi.getAllOrders() : orderApi.getAllOrders({ status: tab })
  )
  console.log(tab)
  console.log(data)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Mutation để duyệt tất cả đơn hàng
  const approveAllMutation = useMutation({
    mutationFn: orderApi.approveAllOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setSuccessMessage(t('approve_all_success'))
      setShowSuccessDialog(true)
    },
    onError: () => {
      setErrorMessage(t('approve_all_error'))
      setShowErrorDialog(true)
    }
  })

  // Mutation để duyệt từng đơn hàng
  const approveOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: number }) =>
      orderApi.approveOrder(orderId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setSuccessMessage(t('approve_order_success'))
      setShowSuccessDialog(true)
    },
    onError: () => {
      setErrorMessage(t('approve_order_error'))
      setShowErrorDialog(true)
    }
  })

  const handleApproveAll = () => {
    setConfirmMessage(t('confirm_approve_all'))
    setConfirmAction(() => () => approveAllMutation.mutate())
    setShowConfirmDialog(true)
  }

  const handleApproveOrder = (orderId: string) => {
    setConfirmMessage(t('confirm_approve_order'))
    setConfirmAction(() => () => approveOrderMutation.mutate({ orderId, status: 1 }))
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    confirmAction()
    setShowConfirmDialog(false)
  }

  const handleCancel = () => {
    setShowConfirmDialog(false)
  }

  // Kiểm tra có đơn hàng nào cần duyệt không
  const hasPendingOrders = data?.data.data.some((order: any) => order.status === 0) || false

  return (
    <div className='bg-gray-50 py-6'>
      <div className='container'>
        <div className='overflow-x-auto'>
          <div className='min-w-[700px]'>
            <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
              {orderTabs.map((tabItem) => (
                <button
                  key={tabItem.status}
                  className={classNames(
                    'flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center transition-all',
                    {
                      'border-b-orange text-orange': String(tab) === String(tabItem.status),
                      'border-b-black/10 text-gray-900 hover:border-b-orange/50': String(tab) !== String(tabItem.status)
                    }
                  )}
                  onClick={() => setTab(tabItem.status)}
                >
                  {t(tabItem.name)}
                </button>
              ))}
            </div>
            <div className='mt-6 rounded-sm bg-white p-6 shadow-sm'>
              {/* Nút duyệt tất cả đơn hàng */}
              <div className='mb-6 flex justify-end'>
                <button
                  onClick={handleApproveAll}
                  disabled={approveAllMutation.isLoading || !hasPendingOrders}
                  className='rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:bg-gray-400'
                >
                  {approveAllMutation.isLoading ? t('processing') : t('approve_all_orders')}
                </button>
              </div>
              <div className='divide-y divide-gray-200'>
                {data?.data.data.length === 0 && (
                  <div className='py-8 text-center text-gray-500'>{t('no_matching_orders')}</div>
                )}
                {data?.data.data.map((order: any) => (
                  <div key={order._id} className='py-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='font-medium text-gray-900'>{t('order_code')}:</span>
                          <span className='text-gray-600'>{order._id}</span>
                        </div>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='font-medium text-gray-900'>{t('purchase_date')}:</span>
                          <span className='text-gray-600'>{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='font-medium text-gray-900'>{t('total')}:</span>
                          <span className='font-medium text-orange'>₫{formatCurrency(order.total)}</span>
                        </div>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='font-medium text-gray-900'>{t('status')}:</span>
                          <span
                            className={classNames('font-medium', {
                              'text-orange': order.status === 0,
                              'text-green-600': order.status === 1,
                              'text-red-600': order.status === 2
                            })}
                          >
                            {order.status === 0 && t('waiting_for_confirmation')}
                            {order.status === 1 && t('received')}
                            {order.status === 2 && t('cancelled')}
                            {order.status !== 0 && order.status !== 1 && order.status !== 2 && t('unknown')}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        {/* Nút duyệt đơn hàng (chỉ hiện khi status = 0) */}
                        {order.status === 0 && (
                          <button
                            onClick={() => handleApproveOrder(order._id)}
                            disabled={approveOrderMutation.isLoading}
                            className='rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
                          >
                            {approveOrderMutation.isLoading ? t('processing') : t('approve_order')}
                          </button>
                        )}
                        <button
                          className='rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200'
                          onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                        >
                          {expanded === order._id ? t('collapse') : t('expand')}
                        </button>
                      </div>
                    </div>
                    {expanded === order._id && (
                      <div className='mt-4 rounded-lg bg-gray-50 p-4'>
                        {order.items.map((item: any) => (
                          <div
                            key={item.product._id}
                            className='flex items-center space-x-4 border-b border-gray-200 py-3 last:border-b-0'
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className='h-16 w-16 rounded-md object-cover'
                            />
                            <div className='flex-1'>
                              <div className='font-medium text-gray-900'>{item.product.name}</div>
                              <div className='mt-1 text-sm text-gray-600'>
                                {t('quantity')}: {item.quantity}
                              </div>
                            </div>
                            <div className='font-medium text-orange'>₫{formatCurrency(item.price)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <h3 className='mb-4 text-lg font-medium text-gray-900'>{t('confirm')}</h3>
            <p className='mb-6 text-gray-600'>{confirmMessage}</p>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={handleCancel}
                className='rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <div className='flex items-center'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <svg className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-lg font-medium text-gray-900'>{t('success')}</h3>
                <p className='mt-1 text-gray-600'>{successMessage}</p>
              </div>
            </div>
            <div className='mt-6 flex justify-end'>
              <button
                onClick={() => setShowSuccessDialog(false)}
                className='rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
              >
                {t('ok')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <div className='flex items-center'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                <svg className='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-lg font-medium text-gray-900'>{t('error')}</h3>
                <p className='mt-1 text-gray-600'>{errorMessage}</p>
              </div>
            </div>
            <div className='mt-6 flex justify-end'>
              <button
                onClick={() => setShowErrorDialog(false)}
                className='rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700'
              >
                {t('ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
