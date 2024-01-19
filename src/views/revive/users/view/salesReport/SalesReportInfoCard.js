// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Badge, Row, Col, Alert } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { capitaliseStr } from '../../../../../utility/HelperFunc'

const callStatusOptions = {
  NoAnswer: 'No Answer',
  FirstAnswer: 'Answer on first ring',
  SecondAnswer: 'Answer on second ring',
  NumberBusy: 'Number Busy',
  OutOfReach: 'Out Of Reach',
  PickAndEnd: 'Pick up and ended the call',
}
const salesStatusOptions = {
  NoInterested: 'No Interested',
  moreInfo: 'Need More Information',
  noIdeaInterested: 'Has no idea and interested',
  noIdeaUninterested: 'Has no idea and not interested',
  requestCallback: 'Request a callback',
}
const salesClosingStatusOptions = {
  RDx1: 'Retention Deportation x1',
  RDx2: 'Retention Deportation x4',
  RDx3: 'Retention Deportation x3',
  RDx4: 'Retention Deportation x4',
}

const LeadActivityInfoCard = ({
  callStatus,
  salesStatus,
  salesClosingStatus,
  notes,
  date,
  time,
  createdBy,
}) => {
  return (
    <>
      <Card>
        <CardBody className='d-flex align-items-center justify-content-center'>
          <div className='w-100'>
            <div className='border-bottom pt-1 d-flex justify-content-between'>
              <h6>Sales Report Details </h6>
              {date && date} - {time && time}
            </div>
            <div className='pt-2 d-flex justify-content-center flex-column'>
              <dl>
                <Row>
                  <Col sm='6'>
                    <dt>
                      <strong>Last Call Status</strong>
                    </dt>
                  </Col>
                  <Col sm='6'>
                    <dd>
                      <Badge color='success'>
                        {callStatus && callStatusOptions[callStatus]}
                      </Badge>
                    </dd>
                  </Col>
                </Row>
              </dl>
              <dl>
                <Row>
                  <Col sm='6'>
                    <dt>
                      <strong>Sales Status </strong>
                    </dt>
                  </Col>
                  <Col sm='6'>
                    <dd>
                      <Badge color='secondary'>
                        {salesStatus && salesStatusOptions[salesStatus]}
                      </Badge>
                    </dd>
                  </Col>
                </Row>
              </dl>
              <dl>
                <Row>
                  <Col sm='6'>
                    <dt>
                      <strong>Sales Closing Status</strong>
                    </dt>
                  </Col>
                  <Col sm='6'>
                    <dd>
                      <Badge color='secondary'>
                        {salesClosingStatus &&
                          salesClosingStatusOptions[salesClosingStatus]}
                      </Badge>
                    </dd>
                  </Col>
                </Row>
              </dl>
              <Alert color='success'>
                <div className='p-1'>
                  <h6 className='text-success'>Notable Details</h6>
                  <small>{notes && notes}</small>
                </div>
              </Alert>
            </div>
            <div className='border-top pt-1 d-flex justify-content-end'>
              <h6>Created By : {createdBy && capitaliseStr(createdBy)}</h6>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default LeadActivityInfoCard
