// ** React Import
import { useState } from 'react'

// ** Custom Components

// ** Icons Import
import { BsFillSaveFill } from 'react-icons/bs'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Button,
  Input,
  Label,
  CardHeader,
  CardTitle,
} from 'reactstrap'

// ** Third Party Components
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'

const defaultValues = {
  username: 'johndoe283',
  supportEmail: 'example@gmail.com',
  mailPort: '948',
  mailHost: 'support.yini.com',
  encryptionType: 'tls',
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const MailSettings = () => {
  // ** States
  const [data, setData] = useState(null)

  // ** Store Vars
  const dispatch = useDispatch()

  const mailPort = [
    { value: '948', label: '948' },
    { value: '983', label: '983' },
    { value: '832', label: '832' },
    { value: '230', label: '230' },
  ]

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setData(data)
    if (checkIsValid(data)) {
      toggleSidebar()
      dispatch(
        editCurrency({
          mailPort: data.mailPort,
          mailHost: data.mailHost,
        })
      )
    } else {
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mail Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='username'>
                  Username <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='username'
                      placeholder='eg. 12'
                      invalid={errors.username && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='password'>
                  Password <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='password'
                      placeholder='***********'
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </Col>
            </Row>
            <div className='mb-2'>
              <Label className='form-label' for='mailHost'>
                Mail Host <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='mailHost'
                control={control}
                render={({ field }) => (
                  <Input
                    id='mailHost'
                    placeholder='eg. 12'
                    invalid={errors.mailHost && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='supportEmail'>
                Support Email Address Host{' '}
                <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='supportEmail'
                control={control}
                render={({ field }) => (
                  <Input
                    id='supportEmail'
                    placeholder='eg. 12'
                    invalid={errors.supportEmail && true}
                    {...field}
                  />
                )}
              />
            </div>
            <Row>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='mailPort'>
                  Mail Port<span className='text-danger'>*</span>
                </Label>
                <Select
                  id='mailPort'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={mailPort}
                  theme={selectThemeColors}
                  defaultValue={mailPort[0]}
                />
              </Col>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='encryptionType'>
                  Encryption Type <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='encryptionType'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='encryptionType'
                      placeholder='eg. tls'
                      invalid={errors.encryptionType && true}
                      {...field}
                    />
                  )}
                />
              </Col>
            </Row>

            <Button type='submit' className='w-100' color='primary'>
              <BsFillSaveFill size={16} className='me-1' />
              Save
            </Button>
          </Form>
        </CardBody>
      </Card>
    </>
  )
}

export default MailSettings
