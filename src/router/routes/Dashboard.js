// ** React Imports
import { lazy } from 'react'

const Dashboard = lazy(() => import('../../views/revive/dashboard'))

const AppRoutes = [
  {
    element: <Dashboard />,
    path: '/dashboard',
  },
]

export default AppRoutes
