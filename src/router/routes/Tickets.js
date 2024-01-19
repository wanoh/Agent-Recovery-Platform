// ** React Imports
import { lazy } from 'react'

const Tickets = lazy(() => import('../../views/revive/tickets/chat'))

const AppRoutes = [
  {
    element: <Tickets />,
    path: '/tickets',
    meta: {
      appLayout: true,
      className: 'chat-application',
    },
  },
]

export default AppRoutes
