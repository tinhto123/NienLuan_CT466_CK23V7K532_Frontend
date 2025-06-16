import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from 'src/utils/auth'
import { useState, createContext } from 'react'
import { User } from 'src/types/user.type'
import { Purchase } from 'src/types/purchase.type'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  setExtendsPurchase: React.Dispatch<React.SetStateAction<ExtendsPurchase[]>>
  extendsPurchase: ExtendsPurchase[]
  reset: () => void
  isLanguage: boolean
  setLanguage: React.Dispatch<React.SetStateAction<boolean>> // Giả sử setLanguage là kiểu string
}
const initialContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null,
  setExtendsPurchase: () => null,
  extendsPurchase: [],
  reset: () => null,
  isLanguage: false,
  setLanguage: () => null
}
interface ExtendsPurchase extends Purchase {
  checked: boolean
  disable: boolean
}
export const AppContext = createContext<AppContextInterface>(initialContext)
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialContext.profile)
  const [extendsPurchase, setExtendsPurchase] = useState<ExtendsPurchase[]>([])
  const [isLanguage, setLanguage] = useState<boolean>(initialContext.isLanguage)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }
  return (
    <AppContext.Provider
      value={{
        reset,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendsPurchase,
        setExtendsPurchase,
        isLanguage,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
