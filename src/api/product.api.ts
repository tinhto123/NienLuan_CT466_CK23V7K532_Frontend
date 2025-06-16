import http from 'src/utils/http'
import { Product, ProductConfig, ProductList } from '../types/product.type'
import { SuccessResponse } from 'src/types/utils.type'

const URL = 'products'
const productAPI = {
  getProducts(params: ProductConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, { params })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  },
  addProduct(body: FormData) {
    // Let axios automatically handle the Content-Type for FormData
    return http.post<SuccessResponse<Product>>(URL, body)
  },
  updateProduct(id: string, body: FormData) {
    // Let axios automatically handle the Content-Type for FormData
    return http.put<SuccessResponse<Product>>(`${URL}/${id}`, body)
  },
  deleteProduct(id: string) {
    return http.delete<SuccessResponse<{ message: string; deletedCount: number }>>(`${URL}/${id}`)
  },
  // API upload 1 ảnh
  uploadSingleImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    return http.post<SuccessResponse<{ imageUrl: string }>>(`${URL}/upload-single`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // API upload nhiều ảnh
  uploadMultipleImages(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })
    return http.post<SuccessResponse<{ imageUrls: string[] }>>(`${URL}/upload-multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
export default productAPI
