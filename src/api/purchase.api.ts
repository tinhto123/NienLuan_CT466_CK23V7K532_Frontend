import { Purchase } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: number }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, { params })
  },
  buyProducts(purchases: Purchase[]) {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, purchases)
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchases(data: { purchaseIds: string[] }) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
      data
    })
  },
  approvePurchase(purchaseId: string, status: number) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/${purchaseId}/approve`, { status })
  }
}
export default purchaseApi
