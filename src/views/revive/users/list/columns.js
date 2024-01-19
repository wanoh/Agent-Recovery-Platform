// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { getUser, deleteUser } from '../store'

// ** Icons Imports
import { Trash2, Edit, Eye } from 'react-feather'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'
import { BsViewList } from 'react-icons/bs'

// ** Renders Client Columns
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className='me-1'
      color={row.avatarColor || 'light-primary'}
      content={row.fullName || row.email}
    />
  )
}

const statusObj = {
  Offline: 'light-danger',
  Online: 'light-success',
  Verified: 'light-success',
  Unverified: 'light-danger',
  Gold: 'light-warning',
  Platinum: 'light-info',
  Silver: 'light-secondary',
}

export const columns = (handleDeleteUser) => [
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
    name: 'Country',
    sortable: true,
    minWidth: '164px',
    sortField: 'userId',
    selector: (row) => row.country,
    cell: (row) => row.country,
  },
  {
    name: 'Contact',
    minWidth: '164px',
    sortable: true,
    sortField: 'plan',
    selector: (row) => row.contact,
    cell: (row) => row.contact,
  },
  {
    name: 'Verification',
    minWidth: '180px',
    sortable: true,
    sortField: 'emailVerified',
    selector: (row) => row.emailVerified,
    cell: (row) => (
      <Badge
        className='text-capitalize'
        color={statusObj[row.emailVerified ? 'Verified' : 'Unverified']}
      >
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
      <div className='d-flex gap-1'>
        <div>
          <Link
            to={`/user/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getUser(row.id))}
          >
            <Eye size={14} className='me-50' />
            <span>View</span>
          </Link>
        </div>
      </div>
    ),
  },
]
