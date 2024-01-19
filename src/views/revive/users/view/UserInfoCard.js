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
import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

import { countryOptions } from '../../../../utility/HelperFunc'
import { useParams } from 'react-router-dom'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../configs/firebase'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

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

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  // ** State
  const [show, setShow] = useState(false)

  const { id } = useParams()

  const userStore = useSelector((state) => state.users)

  const getAgents = () => {
    return userStore.data.filter((user) => user.role === 'agent')
  }

  const agentsOptions = getAgents().map((agent) => ({
    value: agent.email,
    label: agent.fullName,
  }))

  const selectedCountry =
    selectedUser.profile.country !== ''
      ? {
          label: selectedUser.profile.country,
          value: selectedUser.profile.country,
        }
      : { label: 'Select...', value: '' }

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: selectedUser.profile.fullName.split(' ')[0],
      lastName: selectedUser.profile.fullName.split(' ')[1],
      contact: selectedUser.profile.contact,
      addressOne: selectedUser.profile.addressOne,
      state: selectedUser.profile.state,
      city: selectedUser.profile.city,
      country: selectedCountry,
      assignedAgent: selectedUser?.assignedAgent?.fullName,
    },
  })

  // ** render user img
  const renderUserImg = () => {
    return (
      <Avatar
        initials
        color='light-primary'
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

  const onSubmit = async (data) => {
    console.log('Edit user data', data)
    const {
      country,
      firstName,
      lastName,
      contact,
      addressOne,
      state,
      city,
      assignedAgent,
    } = data
    try {
      const userProfileCollection = collection(db, 'profiles')
      const userRef = doc(userProfileCollection, id)
      await updateDoc(userRef, {
        fullName: `${firstName} ${lastName}`,
        country: country.value,
        assignedAgent: {
          fullName: assignedAgent.label,
          email: assignedAgent.value,
        },
        contact,
        addressOne,
        state,
        city,
      })
    } catch (error) {
      console.log('Error Updating user 😅😅😅😅😅😅😅', error)
    } finally {
      setShow(false)
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
                    {selectedUser.profile !== null
                      ? selectedUser.profile.fullName
                      : 'Eleanor Aguilar'}
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
            {selectedUser.profile?.lastLogin?.date ? (
              <div className='d-flex align-items-start me-2'>
                <Badge color='light-primary' className='rounded p-75'>
                  <Check className='font-medium-2' />
                </Badge>
                <div className='ms-75' style={{ fontSize: '10px' }}>
                  <p className='mb-0 fw-bold fs-6 text-nowrap'>Last LogIn</p>
                  <p className='lh-base'>
                    {selectedUser.profile?.lastLogin?.date} <br />
                    {selectedUser.profile?.lastLogin?.time}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>User Details</h4>
          <div className='info-container'>
            {selectedUser.profile !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>First Name:</span>
                  <span>{selectedUser.profile.fullName.split(' ')[0]}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Last Name:</span>
                  <span>{selectedUser.profile.fullName.split(' ')[1]}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Email:</span>
                  <span>{selectedUser.profile.email}</span>
                </li>

                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Email Status:</span>
                  <Badge
                    className='text-capitalize'
                    color={
                      statusColors[
                        selectedUser.profile.emailVerified
                          ? 'Verified'
                          : 'Unverified'
                      ]
                    }
                  >
                    {selectedUser.profile.emailVerified
                      ? 'Verified'
                      : 'Unverified'}
                  </Badge>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Date Created:</span>
                  <span className='text-capitalize'>
                    {selectedUser.profile.createdAt.date}
                  </span>
                </li>

                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Contact:</span>
                  <span>{selectedUser.profile.contact}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Address:</span>
                  <span>{selectedUser.profile.addressOne}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>City:</span>
                  <span>{selectedUser.profile.city}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Country:</span>
                  <span>{selectedUser.profile.country}</span>
                </li>
              </ul>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
