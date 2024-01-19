// ** React Imports
import { lazy } from 'react'

const BusinessProfile = lazy(() => import('../../views/revive/businessProfile'))

const AppRoutes = [
  {
    element: <BusinessProfile />,
    path: '/business-profile',
  },
]

export default AppRoutes
