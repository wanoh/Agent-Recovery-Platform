import React from 'react'

import { Row, Col } from 'reactstrap'

// ** custom components
import MailSettings from './MailSettings'
import MailInfoCard from './MailInfoCard'

const MailSettingsPage = () => {
  return (
    <div>
      <div className=''>
        <Row>
          <Col xl='8' lg='7'>
            <MailSettings />
          </Col>
          <Col xl='4' lg='5'>
            <MailInfoCard />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default MailSettingsPage
