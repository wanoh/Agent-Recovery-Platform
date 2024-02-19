// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { X, Mail, PhoneCall, Clock } from 'react-feather'
import {
  capitaliseStr,
  formatStrDateTime,
} from '../../../../utility/HelperFunc'

const UserProfileSidebar = (props) => {
  // ** Props
  const { user, handleUserSidebarRight, userSidebarRight } = props
  console.log('@~~~User', user)
  return (
    <div
      className={classnames('user-profile-sidebar', {
        show: userSidebarRight === true,
      })}
    >
      <header className='user-profile-header'>
        <span className='close-icon' onClick={handleUserSidebarRight}>
          <X size={14} />
        </span>
        <div className='header-profile-sidebar'>
          <div className='chat-avatar'>
            <div>
              <Avatar
                initials
                style={{ width: '42', height: '42', padding: '5px' }}
                status={user.onlineStatus}
                className='box-shadow-1 avatar-border'
                color={'light-warning'}
                content={user.fullName || user.email}
              />
            </div>
          </div>
          <h4 className='chat-user-name'>{user.fullName}</h4>
          {/* <span className='user-post'>{capitaliseStr(user.role)}</span> */}
        </div>
      </header>
      <PerfectScrollbar
        className='user-profile-sidebar-area'
        options={{ wheelPropagation: false }}
      >
        <div className='personal-info'>
          <h6 className='section-label mb-1 mt-3'>Personal Information</h6>
          <ul className='list-unstyled'>
            <li className='mb-1'>
              <Mail className='me-75' size={17} />
              <span className='align-middle'>{user && user.email}</span>
            </li>
            <li className='mb-1'>
              <PhoneCall className='me-50' size={17} />
              <span className='align-middle'>{user && user.contact}</span>
            </li>
            <li>
              <Clock className='me-50' size={17} />
              <span className='align-middle'>
                {formatStrDateTime(user.lastLogin?.date, user.lastLogin?.time)}
              </span>
            </li>
          </ul>
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default UserProfileSidebar
