import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenReponse } from 'src/types/auth.type'
import {
  saveAccessTokenToLocalStorage,
  clearAccessTokenToLocalStorage,
  getAccessTokenFromLocalStorage,
  saveUserToLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveRefreshTokenToLocalStorage
} from './auth'
import path from 'src/constants/path'
import { URL_LOGIN, URL_REFRESHTOKEN, URL_REGISTER } from 'src/api/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
        // 'expire-access-token': 5,
        // 'expire-refresh-token': 120
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (err) => {
        return Promise.reject(err)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          saveUserToLocalStorage(data.data.user)
          saveAccessTokenToLocalStorage(this.accessToken)
          saveRefreshTokenToLocalStorage(this.refreshToken)
        } else if (url === path.logout) {
          this.accessToken = ''
          this.refreshToken = ''
          clearAccessTokenToLocalStorage()
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // const data: any | undefined = error.response?.data
          // const message = data?.message || error.message
          // toast.error(message)
          if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; mesage: string }>>(error)) {
            if (error.response) {
              const config = error.response?.config || {}
              const { url }: any = config
              if (isAxiosExpiredTokenError(error) && url !== URL_REFRESHTOKEN) {
                this.refreshTokenRequest = this.refreshTokenRequest
                  ? this.refreshTokenRequest
                  : this.handleRefreshToken().finally(() => {
                      setTimeout(() => {
                        this.refreshTokenRequest = null
                      }, 10000)
                    })
                return this.refreshTokenRequest.then((accessToken) => {
                  return this.instance({ ...config, headers: { ...config.headers, authorization: accessToken } })
                })
              }
              clearAccessTokenToLocalStorage()
              this.accessToken = ''
              this.refreshToken = ''
              toast.error(error.response?.data.data?.mesage || error.response?.data.message)
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESHTOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        saveAccessTokenToLocalStorage(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance
export default http
