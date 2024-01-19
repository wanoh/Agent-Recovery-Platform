import React from 'react'

import { Row, Col } from 'reactstrap'

// ** custom components
import CryptoSettings from './CryptoSettings'
import CryptoInfoCard from './CryptoInfoCard'

const CryptoCurrencySettingsPage = () => {
  return (
    <div>
      <Row>
        <Col xl='8' lg='7'>
          <CryptoSettings />
        </Col>
        <Col xl='4' lg='5'>
          <CryptoInfoCard />
        </Col>
      </Row>
    </div>
  )
}

export default CryptoCurrencySettingsPage
