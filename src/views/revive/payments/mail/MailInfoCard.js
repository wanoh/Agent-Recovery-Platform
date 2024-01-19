// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Badge } from 'reactstrap'

// ** Icons Imports
import { HiMail } from 'react-icons/hi'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const MailInfoCard = ({
  username,
  mailHost,
  mailPort,
  encryptionType,
  supportEmail,
  status,
}) => {
  return (
    <>
      <Card>
        <CardBody className='d-flex align-items-center justify-content-center flex-column'>
          <div className='d-flex flex-column align-items-center justify-content-center mb-2'>
            <div
              className='rounded-circle bg-secondary d-flex align-items-center justify-content-center'
              style={{ width: '100px', height: '100px' }}
            >
              <HiMail size={46} />
            </div>
            <h6 className='text-center mt-2 h4 '>Mail</h6>
          </div>
          <div className='w-100'>
            <h6 className='border-top border-bottom pt-1 pb-1'>Mail Details</h6>
            <p>Username: {username || 'johndoe283'}</p>
            <p>Mail Host: {mailHost || 'support.yini.com'} </p>
            <p>Mail Port: {mailPort || '948'} </p>
            <p>Encryption Type: {encryptionType || 'tls'} </p>
            <p>Support Email Address: {supportEmail || 'example@gmail.com'} </p>
            <p>
              Status:{' '}
              <Badge
                color={`success ${status === 'Live' ? 'success' : 'danger'}`}
              >
                {status || 'Live'}
              </Badge>
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default MailInfoCard
