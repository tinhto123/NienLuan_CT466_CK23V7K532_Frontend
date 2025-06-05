import { User } from 'src/types/user.type'

export const LocalStorageEventTarget = new EventTarget()
export const saveAccessTokenToLocalStorage = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const saveRefreshTokenToLocalStorage = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}
export const clearAccessTokenToLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearAccessTokenToLocalStorage')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('access_token') || ''
}
export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem('refresh_token') || ''
}
export const saveUserToLocalStorage = (profile: User) => {
  const data = JSON.stringify(profile)
  localStorage.setItem('profile', data)
}
export const getProfileFromLocalStorage = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
