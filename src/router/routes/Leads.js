// ** React Imports
import { lazy } from 'react'

const Leads = lazy(() => import('../../views/revive/leads'))

const AppRoutes = [
  {
    element: <Leads />,
    path: '/leads',
    meta: {
      className: 'kanban-application',
    },
  },
]

export default AppRoutes
