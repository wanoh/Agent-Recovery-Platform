// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Badge } from 'reactstrap'

// ** Icons Imports
import { FaBitcoin } from 'react-icons/fa'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const CryptoInfoCard = ({ crypto, walletAddress, status }) => {
  return (
    <>
      <Card>
        <CardBody className='d-flex align-items-center justify-content-center flex-column'>
          <div className='d-flex flex-column align-items-center justify-content-center mb-2'>
            <div
              className='rounded-circle bg-secondary d-flex align-items-center justify-content-center'
              style={{ width: '100px', height: '100px' }}
            >
              <FaBitcoin size={46} />
            </div>
            <h6 className='text-center mt-2 h4 '>Crypto Currency</h6>
          </div>
          <div className='w-100'>
            <h6 className='border-top border-bottom pt-1 pb-1'>
              Crypto Currency Details
            </h6>
            <p>Crypto Currency: {crypto || 'Bitcoin (BTC)'}</p>
            <p>Crypto Wallet: {walletAddress || '94dnSIWeud934sd'} </p>
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

export default CryptoInfoCard
