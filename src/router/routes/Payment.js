// ** React Imports
import { lazy } from 'react'

const Payment = lazy(() => import('../../views/revive/payments'))

const AppRoutes = [
  {
    element: <Payment />,
    path: '/payments',
  },
]

export default AppRoutes
