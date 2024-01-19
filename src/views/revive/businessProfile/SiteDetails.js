// ** React Import
import { useState } from 'react'

// ** Images
import logo from '../../../assets/images/revive/reviveimg.png'
import logoSmll from '../../../assets/images/revive/revive-logo.png'

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
  website: 'www.reviveassets.com',
  email: 'support@reviveassets.com',
  taxId: '94893',
  contact: '+1 234-345-4583',
  address: 'JVC, Dubai',
  copyright: 'ReviveAssets',
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

  const statusOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' },
  ]

  const countryOptions = [
    { value: 'USA', label: 'USA' },
    { value: 'UAE', label: 'UAE' },
    { value: 'UK', label: 'UK' },
    { value: 'Canada', label: 'Canada' },
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
          status: data.status,
          taxId: data.taxId,
        })
      )
    } else {
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Update Company Details</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='website'>
                  Website Title
                </Label>
                <Controller
                  name='website'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='website'
                      placeholder='eg. 12'
                      invalid={errors.website && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='email'>
                  Email
                </Label>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='email'
                      placeholder='eg. support@bussiness.com'
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='taxId'>
                  Tax ID
                </Label>
                <Controller
                  name='taxId'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='taxId'
                      placeholder='eg. 12'
                      invalid={errors.taxId && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='contact'>
                  Contact
                </Label>
                <Controller
                  name='contact'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='contact'
                      placeholder='eg. 12'
                      invalid={errors.contact && true}
                      {...field}
                    />
                  )}
                />
              </Col>
            </Row>
            <div className='mb-2'>
              <Label className='form-label' for='address'>
                Address
              </Label>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <Input
                    id='address'
                    placeholder='eg. JVC, Dubai'
                    invalid={errors.address && true}
                    {...field}
                  />
                )}
              />
            </div>

            <Row>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='status'>
                  Status
                </Label>
                <Select
                  id='status'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={statusOptions}
                  theme={selectThemeColors}
                  defaultValue={statusOptions[0]}
                />
              </Col>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='country'>
                  Country
                </Label>
                <Select
                  id='country'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={countryOptions}
                  theme={selectThemeColors}
                  defaultValue={countryOptions[0]}
                />
              </Col>
            </Row>

            <div className='mb-2'>
              <Label className='form-label' for='copyright'>
                Copyright Text
              </Label>
              <Controller
                name='copyright'
                control={control}
                render={({ field }) => (
                  <Input
                    id='copyright'
                    placeholder='eg. 12'
                    invalid={errors.copyright && true}
                    {...field}
                  />
                )}
              />
            </div>
            <Row className='mb-2'>
              <Col md='6' sm='12'>
                <Label className='form-label' for='inputFile'>
                  Logo
                </Label>
                <Input type='file' id='inputFile' name='fileInput' />
              </Col>
              <Col md='6' sm='12'>
                <Label className='form-label' for='exampleMultipleFileBrowser'>
                  Logo
                </Label>
                <Input type='file' id='inputFile' name='fileInput' />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col md='6' sm='12'>
                <div className='' style={{ border: '1px dashed #ffffff1a' }}>
                  <img src={logo} alt='' className='w-100 p-3' />
                </div>
              </Col>
              <Col md='6' sm='12'>
                <div
                  className='p-5 '
                  style={{ border: '1px dashed #ffffff1a' }}
                >
                  <img src={logoSmll} alt='' className='w-100 p-3' />
                </div>
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
