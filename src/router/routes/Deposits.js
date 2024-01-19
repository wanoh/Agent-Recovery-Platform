// ** React Imports
import { lazy } from 'react'

const Deposit = lazy(() => import('../../views/revive/deposits'))

const AppRoutes = [
  {
    element: <Deposit />,
    path: '/deposits',
  },
]

export default AppRoutes
