import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import orderApi from 'src/api/order.api'
import { formatCurrency } from 'src/utils/utils'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

const orderTabs = [
  { status: 'all', name: 'all' },
  { status: 0, name: 'waiting_for_confirmation' },
  { status: 1, name: 'received' },
  { status: 2, name: 'cancelled' }
]

export default function OrderManagement() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<string | number>('all')
  const { data } = useQuery(['orders', tab], () =>
    tab === 'all' ? orderApi.getOrders() : orderApi.getOrders({ status: tab })
  )

  const [expanded, setExpanded] = useState<string | null>(null)

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
    </div>
  )
}
