import React from 'react'

import { Row, Col } from 'reactstrap'

// ** custom components
import BankSettings from './BankSettings'
import BankInfoCard from './BankInfoCard'

const BankSettingsPage = () => {
  return (
    <div>
      <Row>
        <Col xl='8' lg='7'>
          <BankSettings />
        </Col>
        <Col xl='4' lg='5'>
          <BankInfoCard />
        </Col>
      </Row>
    </div>
  )
}

export default BankSettingsPage
