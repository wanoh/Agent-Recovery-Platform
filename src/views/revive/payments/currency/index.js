import React from 'react'

import { Row, Col } from 'reactstrap'

// ** custom components
import CurrencySettings from './CurrencySettings'
import CurrencyInfo from './CurrencyInfoCard'

const CurrencySettingsPage = () => {
  return (
    <div>
      <div className=''>
        <Row>
          <Col xl='8' lg='7'>
            <CurrencySettings />
          </Col>
          <Col xl='4' lg='5'>
            <CurrencyInfo />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CurrencySettingsPage
