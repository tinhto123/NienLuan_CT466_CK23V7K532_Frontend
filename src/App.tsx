import 'font-awesome/css/font-awesome.min.css'
import { useEffect, useContext } from 'react'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './context/app.context'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearAccessTokenToLocalStorage', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearAccessTokenToLocalStorage', reset)
    }
  }, [reset])
  return (
    <>
      <ToastContainer />
      {routeElement}
    </>
  )
}

export default App
