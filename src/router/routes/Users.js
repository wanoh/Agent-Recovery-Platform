// ** React Imports
import { lazy } from 'react'

const UserList = lazy(() => import('../../views/revive/users/list'))
const UserView = lazy(() => import('../../views/revive/users/view'))

const AppRoutes = [
  {
    element: <UserList />,
    path: '/user',
  },
  {
    element: <UserView />,
    path: '/user/view/:id',
  },
]

export default AppRoutes
