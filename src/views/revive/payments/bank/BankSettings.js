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
  cryptoCurrency: 'Bitcoin (BTC)',
  bank: 'Ghana Commercial Bank (GCB)',
  accountName: 'John Doe',
  accountNumber: '3748020293723',
  routingNumber: '802193',
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const BankSettings = () => {
  // ** States
  const [data, setData] = useState(null)

  // ** Store Vars
  const dispatch = useDispatch()

  const swiftOptions = [
    { value: '1047829', label: '1047829' },
    { value: '3829032', label: '3829032' },
    { value: '9383823', label: '9383823' },
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
          cryptoCurrency: data.cryptoCurrency,
          bank: data.bank,
        })
      )
    } else {
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Crypto Currency Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <Label className='form-label' for='bank'>
                Bank Name<span className='text-danger'>*</span>
              </Label>
              <Controller
                name='bank'
                control={control}
                render={({ field }) => (
                  <Input
                    id='bank'
                    placeholder='eg. Ghana Commercial Bank (GCB)'
                    invalid={errors.bank && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='accountName'>
                Account Name<span className='text-danger'>*</span>
              </Label>
              <Controller
                name='accountName'
                control={control}
                render={({ field }) => (
                  <Input
                    id='accountName'
                    placeholder='eg. John Doe'
                    invalid={errors.accountName && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='accountNumber'>
                Account Number<span className='text-danger'>*</span>
              </Label>
              <Controller
                name='accountNumber'
                control={control}
                render={({ field }) => (
                  <Input
                    id='accountNumber'
                    placeholder='eg. 3748020293723'
                    invalid={errors.accountNumber && true}
                    {...field}
                  />
                )}
              />
            </div>
            <Row className='mb-3'>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='swift'>
                  Iban/Swift <span className='text-danger'>*</span>
                </Label>
                <Select
                  id='swift'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={swiftOptions}
                  theme={selectThemeColors}
                  defaultValue={swiftOptions[0]}
                />
              </Col>
              <Col className='mb-2' xl='6' xs='12'>
                <Label className='form-label' for='routingNumber'>
                  Routing Number <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='routingNumber'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='routingNumber'
                      placeholder='eg. 8748303'
                      invalid={errors.routingNumber && true}
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

export default BankSettings
