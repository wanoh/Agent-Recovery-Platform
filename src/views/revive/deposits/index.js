// ** User List Component
import Table from './Table'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from './StatsHorizontal'

// ** Icons Imports
import { PlusSquare, XOctagon } from 'react-feather'
import { FaFileInvoiceDollar } from 'react-icons/fa6'
import { BsFillClipboard2CheckFill } from 'react-icons/bs'

// ** Styles
import '@styles/react/apps/app-users.scss'
import { useSelector } from 'react-redux'

const UsersList = () => {
  const store = useSelector((state) => state.users)

  const twentyFourHoursInSeconds = 24 * 60 * 60
  const currentTimestamp = Math.floor(Date.now() / 1000) // Current timestamp in seconds

  const twentyFourHoursAgoTimestamp =
    currentTimestamp - twentyFourHoursInSeconds

  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='info'
            statTitle='Total Depsoits'
            icon={<FaFileInvoiceDollar size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  {
                    store.usersTransactionsData.filter(
                      (transaction) => transaction.type === 'Deposit'
                    ).length
                  }
                  <span className='fs-6 fw-lighter text-success'>(+32%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='New Deposits'
            icon={<PlusSquare size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  {
                    store.usersTransactionsData.filter(
                      (transaction) =>
                        transaction.type === 'Deposit' &&
                        transaction.createdAt.seconds >=
                          twentyFourHoursAgoTimestamp
                    ).length
                  }
                  <span className='fs-6 fw-lighter text-success'>(+23%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Approved Deposits'
            icon={<BsFillClipboard2CheckFill size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  {
                    store.usersTransactionsData.filter(
                      (transaction) =>
                        transaction.type === 'Deposit' &&
                        transaction.status === 'Approved'
                    ).length
                  }
                  <span className='fs-6 fw-lighter text-danger'>(-12%)</span>
                </h3>
                <p className='fs-6'>This Week's Analytics</p>
              </>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Declined Deposits'
            icon={<XOctagon size={20} />}
            renderStats={
              <>
                <h3 className='fw-bolder mb-75 text-nowrap d-flex align-items-center gap-1'>
                  {
                    store.usersTransactionsData.filter(
                      (transaction) =>
                        transaction.type === 'Deposit' &&
                        transaction.status === 'Declined'
                    ).length
                  }
                  <span className='fs-6 fw-lighter text-success'>(+12%)</span>
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
