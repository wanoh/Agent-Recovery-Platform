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
  currency: 'USD',
  currencyRate: 12,
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const CurrencySettings = () => {
  // ** States
  const [data, setData] = useState(null)

  // ** Store Vars
  const dispatch = useDispatch()

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CAD', label: 'CAD' },
    { value: 'JPY', label: 'JPY' },
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
          currency: data.currency,
          currencyRate: data.currencyRate,
        })
      )
    } else {
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <Label className='form-label' for='currency'>
                Currency <span className='text-danger'>*</span>
              </Label>
              <Select
                id='country'
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={currencyOptions}
                theme={selectThemeColors}
                defaultValue={currencyOptions[0]}
              />
            </div>
            <div className='mb-3'>
              <Label className='form-label' for='currencyRate'>
                Currency Rate <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='currencyRate'
                control={control}
                render={({ field }) => (
                  <Input
                    id='currencyRate'
                    placeholder='eg. 12'
                    invalid={errors.currencyRate && true}
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

export default CurrencySettings
