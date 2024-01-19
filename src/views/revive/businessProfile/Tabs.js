// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { UserCheck, Upload } from 'react-feather'
import { TbHomeUp } from 'react-icons/tb'

// ** User Components
import Socials from './Socials'
import DescriptiveText from './DescriptiveText'
import SiteDetails from './SiteDetails'
import Utilities from './Utilities'

const ProfileTabs = ({ active, toggleTab }) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <TbHomeUp className='font-medium-3 me-50' />
            <span className='fw-bold'>Site Details</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <UserCheck className='font-medium-3 me-50' />
            <span className='fw-bold'>Socials</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Upload className='font-medium-3 me-50' />
            <span className='fw-bold'>Descriptive Text</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <Upload className='font-medium-3 me-50' />
            <span className='fw-bold'>Utilities</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <SiteDetails />
        </TabPane>
        <TabPane tabId='2'>
          <Socials />
        </TabPane>
        <TabPane tabId='3'>
          <DescriptiveText />
        </TabPane>
        <TabPane tabId='4'>
          <Utilities />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default ProfileTabs
