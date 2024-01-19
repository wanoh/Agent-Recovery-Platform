// ** React Imports
import { useState, Fragment } from 'react'

// ** Logo
import logoSmll from '../../../assets/images/revive/revive-logo.png'

// ** Reactstrap Imports
import { Card, CardBody, Badge } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Icons
import { Facebook, Twitter, Instagram } from 'react-feather'
import { BsPaypal, BsPinterest } from 'react-icons/bs'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { Link } from 'react-router-dom'

const planColors = {
  Silver: 'light-secondary',
  Gold: 'light-warning',
  Platinum: 'light-info',
}

const statusColors = {
  Online: 'light-success',
  Offline: 'light-danger',
  Verified: 'light-success',
  Unverified: 'light-danger',
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' },
]

const MySwal = withReactContent(Swal)

const BusinessInfoCard = ({ selectedUser }) => {
  // ** State
  const [show, setShow] = useState(false)

  // ** Hook
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: selectedUser?.username,
      lastName: selectedUser?.fullName.split(' ')[1],
      firstName: selectedUser?.fullName.split(' ')[0],
    },
  })

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setShow(false)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
          })
        }
      }
    }
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='d-flex flex-column align-items-center justify-content-center mb-2'>
            <div
              className='rounded-circle bg-secondary d-flex align-items-center justify-content-center'
              style={{ width: '100px', height: '100px' }}
            >
              <img src={logoSmll} alt='' className='w-100 p-1' />
            </div>
            <div className='d-flex flex-column align-items-center justify-content-center'>
              <h6 className='text-center mt-2 h4 '>Revive Assets</h6>
              <Badge color='light-primary' className='rounded'>
                Admin
              </Badge>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>
            Company Details
          </h4>
          <div className='info-container'>
            <p>
              <span>Name:</span> Revive Assets
            </p>
            <p>
              <span>Website:</span> reviveassets.com
            </p>
            <p>
              <span>Email:</span> support@reviveassets.com
            </p>
            <p>
              <span>Status:</span>{' '}
              <Badge color='light-success' className='rounded'>
                Live
              </Badge>
            </p>
            <p>
              <span>Email Status:</span>{' '}
              <Badge color='light-success' className='rounded'>
                Verified
              </Badge>
            </p>
            <p>
              <span>Date Created:</span> September 14th, 2023
            </p>
            <p>
              <span>Contact:</span> +1 284-283-8438
            </p>
            <p>
              <span>Address:</span> JVC Dubai
            </p>
            <p>
              <span>Country:</span> UAE
            </p>
          </div>
          <div className='d-flex justify-content-center mt-1 gap-1 '>
            <Link>
              <Facebook size={18} />
            </Link>
            <Link>
              <Twitter size={18} />
            </Link>
            <Link>
              <Instagram size={18} />
            </Link>
            <Link>
              <BsPinterest size={18} />
            </Link>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default BusinessInfoCard
