// ** Icons Imports
import { Trash2, Edit } from 'react-feather'

// ** Reactstrap Imports
import { Badge, Progress } from 'reactstrap'
import { formatNumberWithCommas } from '../../../../../utility/Utils'
import { formatTimestamp } from '../../../../../utility/HelperFunc'

const statusObj = {
  Completed: 'light-success',
  Initiated: 'light-info',
  Processing: 'light-warning',
  Litigated: 'light-danger',
  Forex: 'light-warning',
  Stocks: 'light-primary',
  Commodities: 'light-secondary',
  'Crypto Currency': 'light-info',
  Insurance: 'light-success',
  'Mutual Funds': 'light-danger',
  Futures: 'light-primary',
  Bonds: 'light-warning',
  'Credit Card': 'light-warning',
  Indices: 'light-info',
  'Real Estate': 'light-secondary',
  Options: 'light-secondary',
}

const progressObj = {
  Completed: 'success',
  Initiated: 'info',
  Processing: 'warning',
  Litigated: 'danger',
}

const progressValue = (processStatus) => {
  switch (processStatus) {
    case 'Initiated':
      return 25
    case 'Processing':
      return 50
    case 'Litigated':
      return 75
    case 'Completed':
      return 100
  }
}

export const columns = ({ handleEditClick, handleDelete }) => [
  {
    name: 'ID',
    sortable: true,
    minWidth: '124px',
    sortField: 'userId',
    selector: (row) => row.id,
    cell: (row) => row.id,
  },
  {
    name: 'Company',
    minWidth: '156px',
    sortable: true,
    sortField: 'company',
    selector: (row) => row.company,
    cell: (row) => <span className='text-capitalize'>{row.company}</span>,
  },
  {
    name: 'Reason',
    minWidth: '256px',
    selector: (row) => row.reason,
    cell: (row) => <span className='text-capitalize'>{row.reason}</span>,
  },
  {
    name: 'Status',
    minWidth: '134px',
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
    name: 'Amount',
    minWidth: '154px',
    sortable: true,
    sortField: 'amount',
    selector: (row) => row.amount,
    cell: (row) => (
      <span className='text-capitalize'>
        $ {formatNumberWithCommas(row.amount)}
      </span>
    ),
  },
  {
    name: 'Progress',
    minWidth: '238px',
    sortable: true,
    sortField: 'status',
    selector: (row) => row.status,
    cell: (row) => (
      <Progress
        className={`progress-bar-${progressObj[row.status]} w-100`}
        value={progressValue(row.status)}
        style={{ height: '8px' }}
      />
    ),
  },
  {
    name: 'Date',
    minWidth: '200px',
    sortable: true,
    sortField: 'createdAt',
    selector: (row) => row.createdAt,
    cell: (row) => (
      <span className='text-capitalize'>
        {formatTimestamp(row?.createdAt?.seconds).formattedDate}
        {' - '}
        {formatTimestamp(row?.createdAt?.seconds).formattedTime}
      </span>
    ),
  },
  {
    name: 'Market',
    minWidth: '150px',
    sortable: true,
    sortField: 'market',
    selector: (row) => row.market,
    cell: (row) => (
      <Badge className='text-capitalize' color={statusObj[row.market]} pill>
        {row.market}
      </Badge>
    ),
  },
]
