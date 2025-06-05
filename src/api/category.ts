import http from 'src/utils/http'
import { category } from '../types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
const URL = 'categories'

const categoryAPI = {
  getCategories() {
    return http.get<SuccessResponse<category[]>>(URL)
  },
  addCategory(body: { name: string }) {
    return http.post('/categories', body)
  },
  deleteCategory(id: string) {
    return http.delete(`/categories/${id}`)
  },
  updateCategory(id: string, body: { name: string }) {
    return http.put(`/categories/${id}`, body)
  }
}
export default categoryAPI
