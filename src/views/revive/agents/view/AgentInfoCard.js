// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Button,
  Badge,
  Modal,
  Input,
  Label,
  ModalBody,
  ModalHeader,
} from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Check, Briefcase, X, Users } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { formatTimestamp } from '../../../../utility/HelperFunc'
import { useSelector } from 'react-redux'

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

const AgentInfoCard = ({ selectedUser }) => {
  // ** State
  const [show, setShow] = useState(false)

  // ** Store
  const userStore = useSelector((state) => state.users)

  // ** Hook
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: selectedUser.profile.firstName,
      lastName: selectedUser.profile.lastName,
    },
  })

  // ** render user img
  const renderUserImg = () => {
    return (
      <Avatar
        initials
        color='light-warning'
        className='rounded mt-3 mb-2'
        content={selectedUser.profile.fullName}
        contentStyles={{
          borderRadius: 0,
          fontSize: 'calc(48px)',
          width: '100%',
          height: '100%',
        }}
        style={{
          height: '110px',
          width: '110px',
        }}
      />
    )
  }

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
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
              {renderUserImg()}
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>
                    {selectedUser !== null
                      ? selectedUser.profile.fullName
                      : 'Agent Name'}
                  </h4>
                  {selectedUser.profile !== null ? (
                    <Badge
                      color={statusColors[selectedUser.profile.onlineStatus]}
                      className='text-capitalize'
                    >
                      {selectedUser.profile.onlineStatus}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-around my-2 pt-75'>
            <div className='d-flex align-items-start me-2'>
              <Badge color='light-primary' className='rounded p-75'>
                <Check className='font-medium-2' />
              </Badge>
              <div className='ms-75' style={{ fontSize: '10px' }}>
                <p className='mb-0 fw-bold fs-6 text-nowrap'>Last LogIn</p>
                <p className='lh-base'>
                  {selectedUser.profile.lastLogin.date}
                  <br />
                  {selectedUser.profile.lastLogin.time}
                </p>
              </div>
            </div>
            <div className='d-flex align-items-start'>
              <Badge color='light-primary' className='rounded p-75'>
                <Users className='font-medium-2' />
              </Badge>
              <div className='ms-75' style={{ fontSize: '10px' }}>
                <p className='mb-0 fw-bold fs-6 text-nowrap'>Assigned Users</p>
                <p className='lh-base'>
                  {
                    userStore.data.filter(
                      (user) =>
                        user?.assignedAgent?.email ===
                        selectedUser.profile.email
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Agent Details</h4>
          <div className='info-container'>
            {selectedUser !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Firt Name:</span>
                  <span>{selectedUser.profile.firstName}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Last Name:</span>
                  <span>{selectedUser.profile.lastName}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Email:</span>
                  <span>{selectedUser.profile.email}</span>
                </li>
                {/* <li className='mb-75'>
                  <span className='fw-bolder me-25'>Status:</span>
                  <Badge
                    className='text-capitalize'
                    color={statusColors[selectedUser.profile.onlineStatus]}
                  >
                    {selectedUser.profile.onlineStatus}
                  </Badge>
                </li> */}
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Date Created:</span>
                  <span className='text-capitalize'>
                    {selectedUser.profile.createdAt.date} -{' '}
                    {selectedUser.profile.createdAt.time}
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Contact:</span>
                  <span>{selectedUser.profile.contact}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button
              className='w-100'
              color='primary'
              onClick={() => setShow(true)}
            >
              Edit
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader
          className='bg-transparent'
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit User Information</h1>
            <p>Updating user details will receive a privacy audit.</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='firstName'>
                  First Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='firstName'
                  name='firstName'
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='firstName'
                      placeholder='John'
                      invalid={errors.firstName && true}
                    />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='lastName'>
                  Last Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='lastName'
                  name='lastName'
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='lastName'
                      placeholder='Doe'
                      invalid={errors.lastName && true}
                    />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='email'>
                  Email
                </Label>
                <Input
                  type='email'
                  id='email'
                  defaultValue={selectedUser.email}
                  placeholder='example@domain.com'
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='address'>
                  Address Line 1
                </Label>
                <Input
                  type='address'
                  id='address'
                  defaultValue={selectedUser.addressOne}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='addressTwo'>
                  Address Line 2
                </Label>
                <Input
                  type='addressTwo'
                  id='addressTwo'
                  defaultValue={selectedUser.addressLineTwo}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='state'>
                  State
                </Label>
                <Input id='state' defaultValue={selectedUser.state} />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='zip'>
                  Zip
                </Label>
                <Input id='zip' defaultValue={selectedUser.zipCode} />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='city'>
                  City
                </Label>
                <Input id='city' defaultValue={selectedUser.city} />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='country'>
                  Country
                </Label>
                <Select
                  id='country'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={countryOptions}
                  theme={selectThemeColors}
                  defaultValue={countryOptions[0]}
                />
              </Col>
              <Col xs={12} className='text-center mt-2 pt-50'>
                <Button type='submit' className='w-100' color='primary'>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AgentInfoCard
