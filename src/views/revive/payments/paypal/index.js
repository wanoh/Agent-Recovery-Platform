import React from 'react'

import { Row, Col } from 'reactstrap'

// ** custom components
import PaypalSettings from './PaypalSettings'
import PaypalInfoCard from './PaypalInfoCard'

const PaypalSettingsPage = () => {
  return (
    <div>
      <div className=''>
        <Row>
          <Col xl='8' lg='7'>
            <PaypalSettings />
          </Col>
          <Col xl='4' lg='5'>
            <PaypalInfoCard />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default PaypalSettingsPage
