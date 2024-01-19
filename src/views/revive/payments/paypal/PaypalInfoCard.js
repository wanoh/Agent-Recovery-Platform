// ** Reactstrap Imports
import { Card, CardBody, Badge } from 'reactstrap'

// ** Icons Imports
import { BsPaypal } from 'react-icons/bs'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const PaypalInfoCard = ({ paymentId, paymentSecrete, status }) => {
  return (
    <>
      <Card>
        <CardBody className='d-flex align-items-center justify-content-center flex-column'>
          <div className='d-flex flex-column align-items-center justify-content-center mb-2'>
            <div
              className='rounded-circle bg-secondary d-flex align-items-center justify-content-center'
              style={{ width: '100px', height: '100px' }}
            >
              <BsPaypal size={46} />
            </div>
            <h6 className='text-center mt-2 h4 '>Paypal</h6>
          </div>
          <div className='w-100'>
            <h6 className='border-top border-bottom pt-1 pb-1'>
              Paypal Details
            </h6>
            <p>Paypal ID: {paymentId || 'EJdiis9742ndsi39'}</p>
            <p>Paypal Secrete: {paymentSecrete || 'SDFse3d9443'} </p>
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

export default PaypalInfoCard
