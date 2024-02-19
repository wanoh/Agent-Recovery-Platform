// ** React Imports
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { sendMsg } from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  MessageSquare,
  Menu,
  PhoneCall,
  Video,
  Search,
  MoreVertical,
  Mic,
  Image,
  Send,
} from 'react-feather'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Button,
  InputGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroupText,
  UncontrolledDropdown,
} from 'reactstrap'

const ChatLog = (props) => {
  // ** Props & Store
  const {
    handleUser,
    handleUserSidebarRight,
    handleSidebar,
    store,
    userSidebarLeft,
  } = props
  const { selectedUser } = store
  // console.log('selectedUser', selectedUser)
  // ** Refs & Dispatch
  const chatArea = useRef(null)
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.userData)

  // ** State
  const [msg, setMsg] = useState('')
  const curUserId = userData.id

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length

    if (selectedUserLen) {
      scrollToBottom()
    }
  }, [selectedUser])

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (selectedUser) {
      chatLog = selectedUser.chat.chat
    }

    // console.log('chatLog', chatLog, selectedUser.chat)
    const formattedChatLog = []
    let chatMessageSenderId = curUserId
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: [],
    }
    if (!!chatLog) {
      chatLog.forEach((msg, index) => {
        if (chatMessageSenderId === msg.senderId) {
          msgGroup.messages.push({
            msg: msg.message,
            time: msg.time,
          })
        } else {
          chatMessageSenderId = msg.senderId
          formattedChatLog.push(msgGroup)
          msgGroup = {
            senderId: msg.senderId,
            messages: [
              {
                msg: msg.message,
                time: msg.time,
              },
            ],
          }
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
      })
    }

    return formattedChatLog
  }

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': item.senderId !== userData.id,
          })}
        >
          <div className='chat-avatar'>
            <div>
              <Avatar
                initials
                style={{ width: '42', height: '42', padding: '5px' }}
                className='w-100'
                color={'light-warning'}
                content={
                  selectedUser.contact?.fullName || selectedUser.contact?.email
                }
              />
            </div>
          </div>

          <div className='chat-body'>
            {item.messages.map((chat) => (
              <div key={chat.id} className='chat-content'>
                <p>{chat.msg}</p>
              </div>
            ))}
          </div>
        </div>
      )
    })
  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    handleUserSidebarRight()
    handleUser(obj)
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (
      !Object.keys(selectedUser).length &&
      !userSidebarLeft &&
      window.innerWidth < 992
    ) {
      handleSidebar()
    }
  }

  // ** Sends New Msg
  const handleSendMsg = (e) => {
    e.preventDefault()
    if (msg.trim().length) {
      dispatch(sendMsg({ ...selectedUser, message: msg, curUserId }))
      setMsg('')
    }
  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : 'div'

  return (
    <div className='chat-app-window'>
      <div
        className={classnames('start-chat-area', {
          'd-none': Object.keys(selectedUser).length,
        })}
      >
        <div className='start-chat-icon mb-1'>
          <MessageSquare />
        </div>
        <h4
          className='sidebar-toggle start-chat-text'
          onClick={handleStartConversation}
        >
          Start Conversation
        </h4>
      </div>
      {Object.keys(selectedUser).length ? (
        <div
          className={classnames('active-chat', {
            'd-none': selectedUser === null,
          })}
        >
          <div className='chat-navbar'>
            <header className='chat-header'>
              <div className='d-flex align-items-center'>
                <div
                  className='sidebar-toggle d-block d-lg-none me-1'
                  onClick={handleSidebar}
                >
                  <Menu size={21} />
                </div>
                <div className='chat-avatar'>
                  <div>
                    <Avatar
                      initials
                      style={{ width: '42', height: '42', padding: '5px' }}
                      status={selectedUser.contact?.onlineStatus}
                      className='avatar-border m-0 me-1'
                      color={'light-warning'}
                      content={
                        selectedUser.contact?.fullName ||
                        selectedUser.contact?.email
                      }
                      onClick={() => handleAvatarClick(selectedUser.contact)}
                    />
                  </div>
                </div>
                <h6 className='mb-0'>{selectedUser.contact.fullName}</h6>
              </div>
              <div className='d-flex align-items-center'>
                <PhoneCall
                  size={18}
                  className='cursor-pointer d-sm-block d-none me-1'
                />
                <Video
                  size={18}
                  className='cursor-pointer d-sm-block d-none me-1'
                />
                <Search
                  size={18}
                  className='cursor-pointer d-sm-block d-none'
                />
                <UncontrolledDropdown className='more-options-dropdown'>
                  <DropdownToggle
                    className='btn-icon'
                    color='transparent'
                    size='sm'
                  >
                    <MoreVertical size='18' />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem href='/' onClick={(e) => e.preventDefault()}>
                      View Contact
                    </DropdownItem>
                    <DropdownItem href='/' onClick={(e) => e.preventDefault()}>
                      Mute Notifications
                    </DropdownItem>
                    <DropdownItem href='/' onClick={(e) => e.preventDefault()}>
                      Block Contact
                    </DropdownItem>
                    <DropdownItem href='/' onClick={(e) => e.preventDefault()}>
                      Clear Chat
                    </DropdownItem>
                    <DropdownItem href='/' onClick={(e) => e.preventDefault()}>
                      Report
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </header>
          </div>

          <ChatWrapper
            ref={chatArea}
            className='user-chats'
            options={{ wheelPropagation: false }}
          >
            {selectedUser.chat ? (
              <div className='chats'>{renderChats()}</div>
            ) : null}
          </ChatWrapper>

          <Form className='chat-app-form' onSubmit={(e) => handleSendMsg(e)}>
            <InputGroup className='input-group-merge me-1 form-send-message'>
              <InputGroupText>
                <Mic className='cursor-pointer' size={14} />
              </InputGroupText>
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder='Type your message or use speech to text'
              />
              <InputGroupText>
                <Label className='attachment-icon mb-0' for='attach-doc'>
                  <Image className='cursor-pointer text-secondary' size={14} />
                  <input type='file' id='attach-doc' hidden />
                </Label>
              </InputGroupText>
            </InputGroup>
            <Button className='send' color='primary'>
              <Send size={14} className='d-lg-none' />
              <span className='d-none d-lg-block'>Send</span>
            </Button>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default ChatLog
