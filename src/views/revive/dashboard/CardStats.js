// ** Reactstrap Imports
import { Card, CardImg, CardText } from 'reactstrap'

const CardStats = ({
  icon,
  header,
  title,
  value,
  percentage,
  increment,
  img,
}) => {
  return (
    <Card className='card-stats text-justify p-2 card-body'>
      <div className='d-flex justify-content-center align-items-center card-stats_container'>
        <div>
          <div className='icon-opacity-bg d-flex flex-column justify-content-center align-items-center'>
            {icon}
          </div>
          <div className='text-content d-flex flex-column  mt-2'>
            <CardText className='mb-1 font-weight-bold card-stats-header'>
              {header}
            </CardText>
            <CardText>{title}</CardText>
            <CardText>{value}</CardText>
            <CardText className='icon-opacity-bg-2 d-flex flex-column justify-content-center align-items-center'>
              +{percentage}%
            </CardText>
            <CardText className='text-nowrap'>
              {increment} in the last week
            </CardText>
          </div>
        </div>
        <div className='w-50 '>
          <CardImg src={img} className='card-img'></CardImg>
        </div>
      </div>
    </Card>
  )
}

export default CardStats
