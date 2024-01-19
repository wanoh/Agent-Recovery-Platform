// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './firebase.auth'
import chat from '@src/views/revive/tickets/chat/store'
import users from '@src/views/revive/users/store'
import kanban from '@src/views/revive/leads/store'

const rootReducer = {
  auth,
  chat,
  navbar,
  layout,
  users,
  kanban,
}

export default rootReducer
