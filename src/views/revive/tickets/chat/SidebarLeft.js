// ** React Imports
import { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { selectChat } from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import { formatChatDate, isObjEmpty } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X, Search, CheckSquare, Bell, User, Trash } from 'react-feather'

// ** Reactstrap Imports
import {
  CardText,
  InputGroup,
  InputGroupText,
  Badge,
  Input,
  Button,
  Label,
} from 'reactstrap'

const SidebarLeft = (props) => {
  // ** Props & Store
  const {
    store,
    sidebar,
    handleSidebar,
    userSidebarLeft,
    handleUserSidebarLeft,
  } = props
  const { chats, contacts } = store

  // ** Dispatch
  const dispatch = useDispatch()

  // ** currentUser
  const userData = useSelector((state) => state.auth.userData)

  // ** State
  const [query, setQuery] = useState('')
  const [about, setAbout] = useState('')
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState('online')
  const [filteredChat, setFilteredChat] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])

  // ** Handles User Chat Click
  const handleUserClick = (id) => {
    dispatch(selectChat({ id, curUserId: userData.id }))
    setActive(id)
    if (sidebar === true) {
      handleSidebar()
    }
  }

  useEffect(() => {
    if (!isObjEmpty(store.selectedUser)) {
      if (store.selectedUser.chat) {
        setActive(store.selectedUser.chat.id)
      } else {
        setActive(store.selectedUser.contact.id)
      }
    }
  }, [])

  // ** Renders Chat
  const renderChats = () => {
    if (chats && chats.length && chats.contacts?.length) {
      // console.log('Chats from renderChats', chats)
      if (query.length && !filteredChat.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>No Chats Found</h6>
          </li>
        )
      } else {
        const arrToMap =
          query.length && filteredChat.length ? filteredChat : chats

        return arrToMap.map((item) => {
          const time = formatChatDate(
            item.chat.lastMessage
              ? item.chat.lastMessage.time.seconds
              : new Date()
          )

          return (
            <li
              key={item.fullName}
              onClick={() => handleUserClick(item.id)}
              className={classnames({
                active: active === item.id,
              })}
            >
              <div>
                <Avatar
                  initials
                  style={{ width: '42', height: '42', padding: '5px' }}
                  className='w-100'
                  color={item.avatarColor || 'light-warning'}
                  content={item.fullName || item.email}
                />
              </div>
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.fullName}</h5>
                <CardText className='text-truncate'>
                  {item.chat.lastMessage
                    ? item.chat.lastMessage.message
                    : chats[chats.length - 1].message}
                </CardText>
              </div>
              <div className='chat-meta text-nowrap'>
                <small className='float-end mb-25 chat-time ms-25'>
                  {time}
                </small>
                {item.chat.unseenMsgs >= 1 ? (
                  <Badge className='float-end' color='danger' pill>
                    {item.chat.unseenMsgs}
                  </Badge>
                ) : null}
              </div>
            </li>
          )
        })
      }
    } else {
      return null
    }
  }

  // ** Renders Contact
  const renderContacts = () => {
    if (contacts && contacts.length) {
      if (query.length && !filteredContacts.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>No Chats Found</h6>
          </li>
        )
      } else {
        const arrToMap =
          query.length && filteredContacts.length ? filteredContacts : contacts
        return arrToMap.map((item) => {
          return (
            <li key={item.email} onClick={() => handleUserClick(item.id)}>
              <div>
                <Avatar
                  initials
                  style={{ width: '42', height: '42', padding: '5px' }}
                  className='w-100'
                  color={item.avatarColor || 'light-warning'}
                  content={item.fullName || item.email}
                />
              </div>
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.fullName}</h5>
                <CardText className='text-truncate'>{item.email}</CardText>
              </div>
            </li>
          )
        })
      }
    } else {
      return null
    }
  }

  // ** Handles Filter
  const handleFilter = (e) => {
    setQuery(e.target.value)
    const searchFilterFunction = (contact) =>
      contact.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    const filteredChatsArr = chats.filter(searchFilterFunction)
    const filteredContactssArr = contacts.filter(searchFilterFunction)
    setFilteredChat([...filteredChatsArr])
    setFilteredContacts([...filteredContactssArr])
  }

  return store ? (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft,
          })}
        >
          <header className='chat-profile-header'>
            <div className='close-icon' onClick={handleUserSidebarLeft}>
              <X size={14} />
            </div>
            <div className='header-profile-sidebar'>
              <div className='chat-avatar'>
                <div>
                  <Avatar
                    initials
                    style={{ width: '42', height: '42', padding: '5px' }}
                    status={userData.onlineStatus}
                    className='box-shadow-1 avatar-border'
                    color={'light-warning'}
                    content={userData.fullName || userData.email}
                  />
                </div>
              </div>
              <h4 className='chat-user-name'>{userData.fullName}</h4>
              <span className='user-post'>{userData.role}</span>
            </div>
          </header>
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true,
          })}
        >
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <InputGroup className='input-group-merge ms-1 w-100'>
                <InputGroupText className='round'>
                  <Search className='text-muted' size={14} />
                </InputGroupText>
                <Input
                  value={query}
                  className='round'
                  placeholder='Search or start a new chat'
                  onChange={handleFilter}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className='chat-user-list-wrapper list-group'
            options={{ wheelPropagation: false }}
          >
            <h4 className='chat-list-title'>Chats</h4>
            <ul className='chat-users-list chat-list media-list'>
              {renderChats()}
            </ul>
            <h4 className='chat-list-title'>Agents</h4>
            <ul className='chat-users-list contact-list media-list'>
              {renderContacts()}
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null
}

export default SidebarLeft
