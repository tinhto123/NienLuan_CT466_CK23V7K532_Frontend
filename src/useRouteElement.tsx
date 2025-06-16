import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import RegisterLayout from './Layout/RegisterLayout'
import MainLayout from './Layout/MainLayout'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './context/app.context'
import path from './constants/path'
import CartLayout from './Layout/CartLayout'
import UserLayout from './Pages/User/layouts/UserLayout'

const Login = lazy(() => import('./Pages/Login'))
const Cart = lazy(() => import('./Pages/Cart'))
const Regiter = lazy(() => import('./Pages/Register'))
const ProductDetail = lazy(() => import('./Pages/ProductDetail'))
const ChanePassworld = lazy(() => import('./Pages/User/pages/ChanePassworld'))
const HistoryPurchase = lazy(() => import('./Pages/User/pages/HistoryPurchase'))
const Profile = lazy(() => import('./Pages/User/pages/profile'))
const ProductList = lazy(() => import('./Pages/ProductList'))
const PageNotFound = lazy(() => import('./Pages/NotFound'))
const OrderManagement = lazy(() => import('./Pages/User/pages/orderManagement'))
const CategoryManagement = lazy(() => import('./Pages/User/pages/categoryManagement'))
const ProductManagement = lazy(() => import('./Pages/User/pages/productManagement'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

function ProtectedAdminRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)
  const isAdmin = profile?.roles?.includes('Admin')
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                {' '}
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChanePassworld />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              )
            },
            {
              element: <ProtectedAdminRoute />,
              children: [
                {
                  path: path.orderManagement,
                  element: (
                    <Suspense>
                      <OrderManagement />
                    </Suspense>
                  )
                },
                {
                  path: '/user/category-management',
                  element: (
                    <Suspense>
                      <CategoryManagement />
                    </Suspense>
                  )
                },
                {
                  path: '/user/product-management',
                  element: (
                    <Suspense>
                      <ProductManagement />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                {' '}
                <Regiter />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            {' '}
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '/:nameId',
      element: (
        <MainLayout>
          <Suspense>
            {' '}
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <PageNotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}
