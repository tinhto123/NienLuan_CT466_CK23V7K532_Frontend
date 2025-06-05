import http from 'src/utils/http'

const URL = 'orders'

const orderApi = {
  getOrders(params?: { status?: string | number }) {
    return http.get(URL, { params })
  },
  // API cho admin lấy tất cả đơn hàng
  getAllOrders(params?: { status?: string | number }) {
    return http.get(`${URL}/all`, { params })
  },
  // API cho admin duyệt tất cả đơn hàng chờ duyệt
  approveAllOrders() {
    return http.post(`${URL}/approve-all`)
  },
  // API cho admin duyệt từng đơn hàng
  approveOrder(orderId: string, body: { status: number }) {
    return http.post(`${URL}/${orderId}/approve`, body)
  },
  cancelOrder(orderId: string) {
    return http.post(`${URL}/${orderId}/cancel`)
  }
}

export default orderApi
