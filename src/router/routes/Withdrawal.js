// ** React Imports
import { lazy } from 'react'

const Withdrawals = lazy(() => import('../../views/revive/withdrawal'))

const AppRoutes = [
  {
    element: <Withdrawals />,
    path: '/withdrawals',
  },
]

export default AppRoutes
