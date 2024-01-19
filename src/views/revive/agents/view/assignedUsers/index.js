// ** User List Component
import Table from './Table'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from './StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='info'
            statTitle='Total Users'
            icon={<User size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  21,459
                  <span className='fs-6 fw-lighter text-success'>(+26%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Active Users'
            icon={<UserPlus size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  4,567
                  <span className='fs-6 fw-lighter text-success'>(+18%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Verified Users'
            icon={<UserCheck size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  21,459
                  <span className='fs-6 fw-lighter text-danger'>(-26%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Unverified Users'
            icon={<UserX size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  237
                  <span className='fs-6 fw-lighter text-success'>(+42%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
      </Row>
      <Table />
    </div>
  )
}

export default UsersList
