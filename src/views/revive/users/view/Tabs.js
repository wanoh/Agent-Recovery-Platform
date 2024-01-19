// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { UserCheck, Upload, Download, Activity } from 'react-feather'
import { TbHomeUp } from 'react-icons/tb'
import { LuActivitySquare } from 'react-icons/lu'
import { MdRecentActors } from 'react-icons/md'

// ** User Components
import Verification from './verifications'
import WithdrawalsTable from './withdrawals/Table'
import DepositsTable from './deposits/Table'
import IncomingTable from './recoveries/Table'
import ActivityTimeline from './activityTimeline/BasicTimeline'
import UserActivity from './userActivity/IconsTimeline'
import SalesReport from './salesReport'

const UserTabs = ({ active, toggleTab }) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <TbHomeUp className='font-medium-3 me-50' />
            <span className='fw-bold'>Recoveries</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <UserCheck className='font-medium-3 me-50' />
            <span className='fw-bold'>Verifications</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Upload className='font-medium-3 me-50' />
            <span className='fw-bold'>Withdrawals</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <Download className='font-medium-3 me-50' />
            <span className='fw-bold'>Deposits</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            <Activity className='font-medium-3 me-50' />
            <span className='fw-bold'>Activity Timeline</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
            <LuActivitySquare className='font-medium-3 me-50' />
            <span className='fw-bold'>Sales Report</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
            <MdRecentActors className='font-medium-3 me-50' />
            <span className='fw-bold'>User Activity</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <IncomingTable />
        </TabPane>
        <TabPane tabId='2'>
          <Verification />
        </TabPane>
        <TabPane tabId='3'>
          <WithdrawalsTable />
        </TabPane>
        <TabPane tabId='4'>
          <DepositsTable />
        </TabPane>
        <TabPane tabId='5'>
          <ActivityTimeline />
        </TabPane>
        <TabPane tabId='6'>
          <SalesReport />
        </TabPane>
        <TabPane tabId='7'>
          <UserActivity />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
