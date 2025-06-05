import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expire_access_token: number
  expire_refresh_token: number
  expires: string
  user: User
}>
export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
