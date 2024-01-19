// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { v4 as uuidv4 } from 'uuid'

// ** Toast
const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, Row, Spinner } from 'reactstrap'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../../configs/firebase'
import { doc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import moment from 'moment'
import { generateRandomId } from '../../../../utility/HelperFunc'

// **
const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
}

// ** Initial Transactions Values for users
const assignedUsers = []

// ** YUP Validation Schema
const formSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  contact: yup.string().required('Contact is required'),
})

// ** Split Email Func.
function splitEmail(email) {
  const atIndex = email.indexOf('@') // Find the index of the @ symbol
  if (atIndex === -1) {
    // If no @ symbol is found, return null
    return null
  }
  const username = email.slice(0, atIndex) // Get the substring before the @ symbol
  const domain = email.slice(atIndex + 1) // Get the substring after the @ symbol
  return { username, domain } // Return an object containing the username and domain
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [pending, setPending] = useState(false)

  // ** Random uuid password with dashes
  const uuid = uuidv4()

  // ** Default password without dashes
  const defaultPasswordValue = `${uuid.slice(0, 10)}Ra@23`
  const defaultPassword = true

  // ** Agent role
  const role = 'agent'

  // ** Agent Online Status
  const onlineStatus = 'Offline'

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(formSchema) })

  // ** handle register function, takes in the firebase user obj and the input form data
  const handleRegisterAgent = async ({ firebaseUser, data }) => {
    console.log('firebaseAgent', firebaseUser, 'Data', data)
    // ** User Info from firebase
    const { email: authEmail, uid: userId, photoURL } = firebaseUser
    const { refreshToken } = firebaseUser.stsTokenManager
    const { creationTime, lastSignInTime } = firebaseUser.metadata

    // ** Split email to get username
    const { username } = splitEmail(authEmail)

    // ** Temp role
    const tempRole = [{ action: 'manage', subject: 'all' }]

    // ** Form Input values
    const { firstName, lastName, contact } = data

    const fullName = `${firstName} ${lastName}`

    // ** Date Created
    const createdAtDate = moment(
      creationTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('DD/MM/YYYY')
    const createdAtTime = moment(
      creationTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('HH:mm:ss')

    // ** Last LogIn Details
    const lastLoginDate = moment(
      lastSignInTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('DD/MM/YYYY')
    const lastLoginTime = moment(
      lastSignInTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('HH:mm:ss')

    // ** User Data Structure
    const agentData = {
      ability: tempRole,
      email: authEmail,
      id: userId,
      agentId: generateRandomId(),
      refreshToken,
      role,
      avatar: photoURL,
      username,
      firstName,
      lastName,
      fullName,
      contact,
      createdAt: {
        date: createdAtDate,
        time: createdAtTime,
      },
      lastLogin: {
        date: lastLoginDate,
        time: lastLoginTime,
      },
      onlineStatus,
      numberOfAssignedUsers: 0,
      password: [{ defaultPassword, defaultPasswordValue }],
    }

    console.log('User Data', agentData)

    // ** Save User Data to Firestore
    await setDoc(doc(db, 'profiles', userId), agentData)
    await setDoc(doc(db, 'agentAccounts', userId), { assignedUsers })
  }

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    setPending(true)
    try {
      if (checkIsValid(data)) {
        const { email } = data

        const userCrednetials = await createUserWithEmailAndPassword(
          auth,
          email,
          defaultPasswordValue
        )

        // ** User Object returned from Firebase
        const firebaseUser = userCrednetials.user

        const user = {
          firebaseUser,
          data,
        }

        handleRegisterAgent(user)
        setPending(false)
        toggleSidebar()
        toast.success((t) => (
          <ToastContent msg={'Agent Account created successfully!'} />
        ))
      } else {
        setPending(false)
      }
    } catch (error) {
      console.log(error)
      setPending(false)
      toggleSidebar()
      toast.error((t) => <ToastContent msg={'Error creating Agent Account!'} />)
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New Agent'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='firstName'>
            First Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='firstName'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                id='firstName'
                placeholder='John'
                invalid={!!errors.firstName} // Simplified error check
                {...field}
              />
            )}
          />
          {errors.firstName && (
            <span className='text-danger'>{errors.firstName.message}</span>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='lastName'>
            Last Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='lastName'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                id='lastName'
                placeholder='Doe'
                invalid={errors.lastName && true}
                {...field}
              />
            )}
          />
          {errors.lastName && (
            <span className='text-danger'>{errors.lastName.message}</span>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='userEmail'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                type='email'
                id='userEmail'
                placeholder='john.doe@example.com'
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          {errors.email && (
            <span className='text-danger'>{errors.email.message}</span>
          )}
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='contact'>
            Contact <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='contact'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                id='contact'
                placeholder='245678901'
                invalid={errors.contact && true}
                {...field}
              />
            )}
          />
          {errors.contact && (
            <span className='text-danger'>{errors.contact.message}</span>
          )}
        </div>

        <Button
          type='submit'
          className='me-1'
          color='primary'
          disabled={pending}
        >
          {pending && <Spinner className='me-1' color='light' size='sm' />}
          <span>Submit</span>
        </Button>
        <Button
          type='reset'
          color='secondary'
          outline
          onClick={toggleSidebar}
          disabled={pending}
        >
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
