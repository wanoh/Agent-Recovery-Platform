// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Badge } from 'reactstrap'

// ** Icons Imports
import { BsBank2 } from 'react-icons/bs'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const BankInfoCard = ({
  bank,
  accountNumber,
  accountName,
  swift,
  routingNumber,
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
              <BsBank2 size={46} />
            </div>
            <h6 className='text-center mt-2 h4 '>Bank</h6>
          </div>
          <div className='w-100'>
            <h6 className='border-top border-bottom pt-1 pb-1'>Bank Details</h6>
            <p>Bank Name: {bank || 'Ghana Commercial Bank (GCB)'}</p>
            <p>Account Name: {accountName || 'John Doe'} </p>
            <p>Account Number: {accountNumber || '3748020293723'} </p>
            <p>Iban/Swift: {swift || '1047829'} </p>
            <p>Routing Number: {routingNumber || '802193'} </p>
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

export default BankInfoCard
