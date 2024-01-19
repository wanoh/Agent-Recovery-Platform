// ** React Imports
import { useState } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { HiOutlineCurrencyDollar, HiMail } from 'react-icons/hi'
import { FaBitcoin } from 'react-icons/fa'
import { BsBank2, BsPaypal } from 'react-icons/bs'

// ** Components
import Currency from './currency'
import CryptoCurrency from './crypto'
import Bank from './bank'
import Paypal from './paypal'
import Mail from './mail'

const Payment = () => {
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <HiOutlineCurrencyDollar className='font-medium-3 me-50' />
            <span className='fw-bold'>Currency</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <FaBitcoin className='font-medium-3 me-50' />
            <span className='fw-bold'>Crypto</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <BsBank2 className='font-medium-3 me-50' />
            <span className='fw-bold'>Bank</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <BsPaypal className='font-medium-3 me-50' />
            <span className='fw-bold'>Paypal</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            <HiMail className='font-medium-3 me-50' />
            <span className='fw-bold'>Mail</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <Currency />
        </TabPane>
        <TabPane tabId='2'>
          <CryptoCurrency />
        </TabPane>
        <TabPane tabId='3'>
          <Bank />
        </TabPane>
        <TabPane tabId='4'>
          <Paypal />
        </TabPane>
        <TabPane tabId='5'>
          <Mail />
        </TabPane>
      </TabContent>
    </>
  )
}
export default Payment
