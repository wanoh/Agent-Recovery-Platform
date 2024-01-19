// ** Icons Imports
import { Eye, EyeOff } from 'react-feather'

// ** Reactstrap Imports
import { Badge, Button } from 'reactstrap'

// ** Store and Actions
import { store } from '@store/store'
import { toggleVerificationSlider } from '../../store'

const statusObj = {
  Completed: 'light-success',
  Pending: 'light-warning',
  'No Uploads': 'light-danger',
}

export const columns = (previewDetails) => [
  {
    name: 'Name',
    minWidth: '124px',
    selector: (row) => row.proof,
    cell: (row) => <div>{row.proof}</div>,
  },
  {
    name: 'Status',
    minWidth: '184px',
    selector: (row) => row.proofOfVerificationStatus,
    cell: (row) => (
      <div className='centered-cell'>
        <Badge
          className='text-capitalize'
          color={statusObj[row.proofOfVerificationStatus]}
          pill
        >
          {row.proofOfVerificationStatus}
        </Badge>
      </div>
    ),
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: (row) => (
      <div className='centered-cell'>
        {row.proofOfVerificationStatus === 'No Uploads' ? (
          <Button.Ripple
            className='round'
            disabled={true}
            outline
            style={{ padding: '12px 16px' }}
          >
            View <EyeOff size={16} className='ms-1 ' />
          </Button.Ripple>
        ) : (
          <Button.Ripple
            className='round'
            color='dark'
            outline
            style={{ padding: '12px 16px', border: '1px solid white' }}
            onClick={() => previewDetails(row)}
          >
            View
            <Eye size={16} className='ms-1 ' />
          </Button.Ripple>
        )}
      </div>
    ),
  },
]
