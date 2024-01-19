// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { Users } from 'react-feather'
import { MdRecentActors } from 'react-icons/md'

// ** Components
import AssignedUsers from './assignedUsers/Table'
import AgentActivity from './agentActivity/IconsTimeline'

const AgentTabs = ({ active, toggleTab }) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Users className='font-medium-3 me-50' />
            <span className='fw-bold'>Assigned Users</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <MdRecentActors className='font-medium-3 me-50' />
            <span className='fw-bold'>Agent Activity</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <AssignedUsers />
        </TabPane>
        <TabPane tabId='2'>
          <AgentActivity />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default AgentTabs
