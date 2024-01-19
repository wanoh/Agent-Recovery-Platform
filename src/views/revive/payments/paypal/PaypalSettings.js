// ** React Import
import { useState } from 'react'

// ** Custom Components

// ** Icons Import
import { BsFillSaveFill } from 'react-icons/bs'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import {
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
  paymentMode: 'Bitcoin (BTC)',
  paypalId: 'EJdiis9742ndsi39',
  paypalSecrete: 'SDFse3d9443',
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const PaypalSettings = () => {
  // ** States
  const [data, setData] = useState(null)

  // ** Store Vars
  const dispatch = useDispatch()

  const paymentMode = [
    { value: 'Live', label: 'Live' },
    { value: 'Offline', label: 'Offline' },
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
          paymentMode: data.paymentMode,
          paypalId: data.paypalId,
        })
      )
    } else {
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Paypal Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <Label className='form-label' for='paymentMode'>
                Paypal Mode <span className='text-danger'>*</span>
              </Label>
              <Select
                id='paymentMode'
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={paymentMode}
                theme={selectThemeColors}
                defaultValue={paymentMode[0]}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='paypalId'>
                Paypal ID<span className='text-danger'>*</span>
              </Label>
              <Controller
                name='paypalId'
                control={control}
                render={({ field }) => (
                  <Input
                    id='paypalId'
                    placeholder='eg. EJdiis9742ndsi39'
                    invalid={errors.paypalId && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-3'>
              <Label className='form-label' for='paypalSecrete'>
                Payment Secrete<span className='text-danger'>*</span>
              </Label>
              <Controller
                name='paypalSecrete'
                control={control}
                render={({ field }) => (
                  <Input
                    id='paypalSecrete'
                    placeholder='eg. SDFse3d9443'
                    invalid={errors.paypalSecrete && true}
                    {...field}
                  />
                )}
              />
            </div>

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

export default PaypalSettings
