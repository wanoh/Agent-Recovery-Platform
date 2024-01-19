// ** Reactstrap Imports
import { Badge, Button, Card, CardBody, Spinner } from 'reactstrap'

// ** Third Party Imports
import { Hash, Mail, Phone, Star, Flag, User } from 'react-feather'
import { v4 as uuidv4 } from 'uuid'

// ** Redux Imports
import { useDispatch } from 'react-redux'

// ** Actions
import { handleSelectTask, fetchTasks, updateTask } from './store'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../configs/firebase'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'

// ** Initial Users Data Values
import { initBalance, splitEmail } from '../../../utility/HelperFunc'
import {
  transactionsData,
  accountData,
  recoveriesData,
  activityData,
  saleReportData,
} from '../../../utility/HelperFunc'

import toast from 'react-hot-toast'
import { useState } from 'react'
import moment from 'moment'
const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

const KanbanTasks = (props) => {
  // ** Props
  const { task, handleTaskSidebarToggle } = props
  console.log('++task++', task)
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
  const createdBy = 'ConvertedLead'

  // ** Hooks
  const dispatch = useDispatch()

  const handleTaskClick = () => {
    dispatch(handleSelectTask(task))
    handleTaskSidebarToggle()
  }

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
    const {
      firstName: userFirstName = '',
      lastName: userLastName = '',
      fullName: userFullName = '',
      addressOne = '',
      contact = '',
      country = '',
      state = '',
      city = '',
    } = task

    // ** Split email to get username
    const { username } = splitEmail(authEmail)

    // ** Temp role
    const tempRole = [{ action: 'manage', subject: 'all' }]

    // ** Assigned Agent
    const assignedAgent = {
      fullName: 'Admin',
      email: 'admin@gmail.com',
    }

    const firstName = userFirstName
      ? userFirstName
      : userFullName
      ? userFullName.split(' ')[0]
      : username
    const lastName = userLastName
      ? userLastName
      : userFullName
      ? userFullName.split(' ')[1]
      : ''

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
      fullName: userFullName,
      addressOne,
      contact,
      country,
      emailVerified,
      createdAt: {
        date: createdAtDate,
        time: createdAtTime,
      },
      lastLogin: {
        date: lastLoginDate,
        time: lastLoginTime,
      },
      assignedAgent,
      onlineStatus,
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

  // ** Create User Account from lead
  const handleCreateUser = async () => {
    setData(task)
    setPending(true)
    try {
      const userCrednetials = await createUserWithEmailAndPassword(
        auth,
        task.email,
        defaultPasswordValue
      )

      // ** User Object returned from Firebase
      const firebaseUser = userCrednetials.user

      const user = {
        firebaseUser,
        data,
      }

      handleRegisterUser(user)

      const leadsCollectionRef = collection(db, 'leads')
      const leadRef = doc(leadsCollectionRef, task.id)
      await updateDoc(leadRef, {
        leadCloseStatus: true,
      })

      dispatch(fetchTasks())
      setPending(false)
      toast.success((t) => (
        <ToastContent msg={'Client Account created successfully!'} />
      ))
    } catch (error) {
      console.log(error)
      setPending(false)
      toast.error((t) => (
        <ToastContent msg={'Error creating Client Account!'} />
      ))
    }
  }

  const renderLeadDetails = () => {
    return (
      <div className='d-flex flex-column'>
        <p>
          <Hash size={14} /> <strong>Full Name:</strong> {task.fullName}
        </p>
        <p>
          <Mail size={14} /> <strong>Email:</strong> {task.email}
        </p>
        <p>
          <Phone size={14} /> <strong>Phone:</strong> {task.phone}
        </p>
        <p>
          <Star size={14} /> <strong>Status:</strong>{' '}
          <Badge
            color={
              task.status.value === 3
                ? 'success'
                : task.status.value === 2
                ? 'warning'
                : 'info'
            }
          >
            {task.status.label}
          </Badge>
        </p>
        <p>
          <Flag size={14} /> <strong>Country:</strong> {task.country}
        </p>
        {task.status.value === 3 && (
          <div className='ms-auto mt-1'>
            <Button
              size='sm'
              color='primary'
              onClick={(e) => {
                e.stopPropagation()
                handleCreateUser()
              }}
              disabled={pending}
            >
              {!pending ? (
                <div className='d-flex gap-1 align-items-center'>
                  <User size='16' /> <span>Create User</span>
                </div>
              ) : (
                <Spinner size='sm' />
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Card
        onClick={handleTaskClick}
        className='task'
        data-board-id={task.status}
        data-task-id={task.id}
      >
        <CardBody data-task-id={task.id}>{renderLeadDetails()}</CardBody>
      </Card>
    </>
  )
}

export default KanbanTasks
