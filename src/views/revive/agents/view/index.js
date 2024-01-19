// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getUser } from '../../users/store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import UserTabs from './Tabs'
import AgentInfoCard from './AgentInfoCard'

// ** Loader
import Loader from '/src/@core/components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UserView = () => {
  // ** states
  const [loading, setLoading] = useState(true)

  // ** Store Vars
  const store = useSelector((state) => state.users)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getUser(id))
  }, [dispatch])

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

  return store.selectedUser !== null && store.selectedUser !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <AgentInfoCard selectedUser={store.selectedUser} />
        </Col>
        <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  ) : loading ? (
    <Loader className='content-loader' />
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Agent not found</h4>
      <div className='alert-body'>
        Agent with id: {id} doesn't exist. Check list of all Agent:{' '}
        <Link to='/agent'>Agent List</Link>
      </div>
    </Alert>
  )
}
export default UserView
