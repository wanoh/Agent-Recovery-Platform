// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'

// ** Icons Imports
import { Trash2, Edit } from 'react-feather'

// ** Reactstrap Imports
import { Badge, Progress } from 'reactstrap'
import { formatNumberWithCommas } from '../../../../../utility/Utils'
import { formatTimestamp } from '../../../../../utility/HelperFunc'

const statusObj = {
  Approved: 'light-success',
  Pending: 'light-warning',
  Requested: 'light-warning',
  Declined: 'light-danger',
  Bank: 'light-primary',
  'Crypto Currency': 'light-info',
  Paypal: 'light-danger',
  'Credit Card': 'light-warning',
}

export const columns = ({ handleEditClick, handleDeleteTransaction }) => [
  {
    name: 'ID',
    sortable: true,
    minWidth: '124px',
    sortField: 'id',
    selector: (row) => row.id,
    cell: (row) => row.id,
  },
  {
    name: 'Type',
    minWidth: '184px',
    sortable: true,
    sortField: 'type',
    selector: (row) => row.type,
    cell: (row) => (
      <Badge className='text-capitalize' color={statusObj[row.type]} pill>
        {row.type}
      </Badge>
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
  {
    name: 'Date',
    minWidth: '124px',
    sortable: true,
    sortField: 'createdAt',
    selector: (row) => row.createdAt,
    cell: (row) => (
      <span className='text-capitalize'>
        {' '}
        {formatTimestamp(row?.createdAt?.seconds).formattedDate}
        {' - '}
        {formatTimestamp(row?.createdAt?.seconds).formattedTime}
      </span>
    ),
  },
  {
    name: 'Amount',
    minWidth: '138px',
    sortable: true,
    sortField: 'amount',
    selector: (row) => row.amount,
    cell: (row) => (
      <span className='text-capitalize'>
        ${formatNumberWithCommas(row.amount)}
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
]
