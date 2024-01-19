// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { getUser, deleteUser } from '../../../users/store'

// ** Icons Imports
import { Trash2, Edit } from 'react-feather'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

// ** Renders Client Columns
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className='me-1'
      color={row.avatarColor || 'light-primary'}
      content={row.fullName || 'John Doe'}
    />
  )
}

const statusObj = {
  true: 'light-success',
  false: 'light-danger',
  Offline: 'light-danger',
  Online: 'light-success',
  Gold: 'light-warning',
  Platinum: 'light-info',
  Silver: 'light-secondary',
}

export const columns = [
  {
    name: 'User',
    sortable: true,
    minWidth: '300px',
    sortField: 'fullName',
    selector: (row) => row.fullName,
    cell: (row) => (
      <div className='d-flex justify-content-left align-items-center'>
        {renderClient(row)}
        <div className='d-flex flex-column'>
          <span className='fw-bolder'>{row.fullName}</span>
          <small className='text-truncate text-muted mb-0'>{row.email}</small>
        </div>
      </div>
    ),
  },
  {
    name: 'User ID',
    sortable: true,
    minWidth: '124px',
    sortField: 'userId',
    selector: (row) => row.id,
    cell: (row) => row.id,
  },

  {
    name: 'Verification',
    minWidth: '180px',
    sortable: true,
    sortField: 'emailVerified',
    selector: (row) => row.emailVerified,
    cell: (row) => (
      <Badge className='text-capitalize' color={statusObj[row.emailVerified]}>
        {row.emailVerified ? 'Verified' : 'Unverified'}
      </Badge>
    ),
  },
  {
    name: 'Status',
    minWidth: '124px',
    sortable: true,
    sortField: 'onlineStatus',
    selector: (row) => row.onlineStatus,
    cell: (row) => (
      <Badge
        className='text-capitalize'
        color={statusObj[row.onlineStatus]}
        pill
      >
        {row.onlineStatus}
      </Badge>
    ),
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: (row) => (
      <div
        tag='a'
        href='/'
        className='w-100'
        onClick={(e) => {
          e.preventDefault()
          store.dispatch(deleteUser(row.id))
        }}
      >
        <Trash2 size={14} className='me-50' />
      </div>
    ),
  },
]
