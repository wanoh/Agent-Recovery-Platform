// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidv4 } from 'uuid'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, Row, Spinner } from 'reactstrap'

// ** Toast
import toast from 'react-hot-toast'
const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../../configs/firebase'
import { doc, setDoc } from 'firebase/firestore'

// ** Initial Users Data Values
import {
  transactionsData,
  accountData,
  recoveriesData,
  activityData,
  saleReportData,
  countryOptions,
  splitEmail,
  formSchema,
} from '../../../../utility/HelperFunc'
import moment from 'moment'

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  addressOne: '',
  state: '',
  contact: '',
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null)
  const [pending, setPending] = useState(false)

  // ** Random uuid password with dashes
  const uuid = uuidv4()

  // ** Default password without dashes
  const defaultPasswordValue = `${uuid.slice(0, 10)}Ra@23`
  const defaultPassword = true

  // ** User role
  const role = 'client'
  const onlineStatus = 'Offline'

  // ** User created by
  const createdBy = 'admin'

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    // resolver: yupResolver(formSchema),
  })

  // ** handle register function, takes in the firebase user obj and the input form data
  const handleRegisterUser = async ({ firebaseUser, data }) => {
    console.log('firebaseUser', firebaseUser, 'Data', data)
    // ** User Info from firebase
    const {
      email: authEmail,
      uid: userId,
      photoURL,
      emailVerified,
    } = firebaseUser
    const { refreshToken } = firebaseUser.stsTokenManager
    const { creationTime, lastSignInTime } = firebaseUser.metadata

    // ** Split email to get username
    const { username } = splitEmail(authEmail)

    // ** Temp role
    const tempRole = [{ action: 'manage', subject: 'all' }]

    // ** Assigned Agent
    const assignedAgent = {
      fullName: 'Admin',
      email: 'admin@gmail.com',
    }

    // ** Form Input values
    const { firstName, lastName, addressOne, country, state, city, contact } =
      data

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
    const userData = {
      ability: tempRole,
      email: authEmail,
      id: userId,
      refreshToken,
      role,
      avatar: photoURL,
      username,
      firstName,
      lastName,
      fullName,
      addressOne,
      contact,
      country: country.value,
      emailVerified,
      createdAt: {
        date: createdAtDate,
        time: createdAtTime,
      },
      lastLogin: {
        date: lastLoginDate,
        time: lastLoginTime,
      },
      onlineStatus,
      assignedAgent,
      state,
      city,
      password: [{ defaultPassword, defaultPasswordValue }],
    }

    console.log('User Data', userData)

    // ** Save User Data to Firestore
    await setDoc(doc(db, 'profiles', userId), userData)
    await setDoc(doc(db, 'userAccounts', userId), accountData(createdBy))
    await setDoc(doc(db, 'transactions', userId), { transactionsData })
    await setDoc(doc(db, 'recoveries', userId), { recoveriesData })
    await setDoc(doc(db, 'userLogs', userId), { activityData })
    await setDoc(doc(db, 'userSalesReport', userId), { saleReportData })
  }

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    setData(data)
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

        handleRegisterUser(user)
        setPending(false)
        toggleSidebar()
        toast.success((t) => (
          <ToastContent msg={'Client Account created successfully!'} />
        ))
      } else {
        for (const key in data) {
          if (data[key] === null) {
            setError('country', {
              type: 'manual',
            })
          }
          if (data[key] !== null && data[key].length === 0) {
            setError(key, {
              type: 'manual',
            })
          }
        }
        setPending(false)
      }
    } catch (error) {
      console.log(error)
      setPending(false)
      toggleSidebar()
      toast.error((t) => (
        <ToastContent msg={'Error creating Client Account!'} />
      ))
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
      title='New User'
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
          <Label className='form-label' for='addressOne'>
            Address Line 1 <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='addressOne'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                id='addressOne'
                placeholder='12, Business'
                invalid={errors.addressOne && true}
                {...field}
              />
            )}
          />
          {errors.addressOne && (
            <span className='text-danger'>{errors.addressOne.message}</span>
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

        <div className='mb-1'>
          <Label className='form-label' for='country'>
            Country <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={countryOptions}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.country === null,
                })}
                {...field}
              />
            )}
          />
          {errors.country && (
            <span className='text-danger'>{errors.country.message}</span>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='state'>
            State <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='state'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                id='state'
                placeholder='Greater Accra'
                invalid={errors.state && true}
                {...field}
              />
            )}
          />
          {errors.state && (
            <span className='text-danger'>{errors.state.message}</span>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='city'>
            City <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='city'
            control={control}
            render={({ field }) => (
              <Input
                disabled={pending}
                id='city'
                placeholder='00233'
                invalid={errors.city && true}
                {...field}
              />
            )}
          />
          {errors.city && (
            <span className='text-danger'>{errors.city.message}</span>
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
