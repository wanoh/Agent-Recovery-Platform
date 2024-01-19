// ** Reactstrap Imports
import { Card, CardImgOverlay, CardImg, CardText } from 'reactstrap'

// ** Images
import BgImg from '../../../assets/images/revive/backgroundimg.jpg'

const CardCongratulations = ({ fullName, role }) => {
  return (
    <Card className='card-welcome '>
      <CardImg className='card-welcome_bg' src={BgImg}></CardImg>
      <CardImgOverlay className='card-bg-overlay'>
        <div className='card-welcome_text-content h-100 d-flex flex-column  justify-content-center'>
          <CardText className='mb-1 header-text'>
            {`Hello ${fullName}`},
          </CardText>
          <CardText>
            Welcome back, you have full {role} priviledges to manage company
            data
          </CardText>
        </div>
      </CardImgOverlay>
    </Card>
  )
}

export default CardCongratulations
