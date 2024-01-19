// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getUser } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert, Spinner } from 'reactstrap'

import Loader from '/src/@core/components/spinner/Loading-spinner'

// ** User View Components
import UserTabs from './Tabs'
import UserInfoCard from './UserInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UserView = () => {
  // **Loading State
  const [loading, setLoading] = useState(true)

  // ** Store Vars
  const store = useSelector((state) => state.users)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()
  console.log('IDIDID', id)
  // ** Get user on mount
  useEffect(() => {
    dispatch(getUser(id))
  }, [id])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div className='app-user-view'>
      {store.selectedUser !== null && store.selectedUser !== undefined ? (
        <Row>
          <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <UserInfoCard selectedUser={store.selectedUser} />
          </Col>
          <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
            <UserTabs active={active} toggleTab={toggleTab} />
          </Col>
        </Row>
      ) : loading ? (
        <Loader className='content-loader' />
      ) : (
        <Alert color='danger'>
          <h4 className='alert-heading'>User not found</h4>
          <div className='alert-body'>
            User with id: {id} doesn't exist. Check the list of all Users:{' '}
            <Link to='/user'>Users List</Link>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default UserView
