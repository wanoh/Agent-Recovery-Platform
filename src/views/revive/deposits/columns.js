// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { getUser, deleteUser } from '../users/store'

// ** Icons Imports
import { Trash2, Edit } from 'react-feather'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'
import { formatTimestamp } from '../../../utility/HelperFunc'
import { formatNumberWithCommas } from '../../../utility/Utils'

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
  Offline: 'light-danger',
  Online: 'light-success',
  Gold: 'light-warning',
  Platinum: 'light-info',
  Silver: 'light-secondary',
  Approved: 'light-success',
  New: 'light-warning',
  Declined: 'light-danger',
  Bank: 'light-primary',
  'Crypto Currency': 'light-info',
  Paypal: 'light-danger',
  'Credit Card': 'light-warning',
}

export const columns = (handleEditClick) => [
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
    name: 'ID',
    sortable: true,
    minWidth: '134px',
    sortField: 'id',
    selector: (row) => row.id,
    cell: (row) => row.id,
  },
  {
    name: 'Amount',
    minWidth: '148px',
    sortable: true,
    sortField: 'amount',
    selector: (row) => row.amount,
    cell: (row) => (
      <span className='text-capitalize'>
        {formatNumberWithCommas(row.amount)}
      </span>
    ),
  },
  {
    name: 'Status',
    minWidth: '124px',
    sortable: true,
    sortField: 'status',
    selector: (row) => row.status,
    cell: (row) => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status}
      </Badge>
    ),
  },
  {
    name: 'Date',
    minWidth: '200px',
    sortable: true,
    sortField: 'date',
    selector: (row) => row.createdAt.seconds,
    cell: (row) => (
      <span className='text-capitalize'>
        {formatTimestamp(row.createdAt?.seconds).formattedDate} -
        {formatTimestamp(row.createdAt?.seconds).formattedTime}
      </span>
    ),
  },
  {
    name: 'Method',
    minWidth: '184px',
    sortable: true,
    sortField: 'method',
    selector: (row) => row.method,
    cell: (row) => (
      <Badge className='text-capitalize' color={statusObj[row.method]} pill>
        {row.method}
      </Badge>
    ),
  },
]
