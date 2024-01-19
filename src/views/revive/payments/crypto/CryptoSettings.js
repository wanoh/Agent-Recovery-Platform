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
  cryptoCurrency: 'Bitcoin (BTC)',
  walletAddress: '94dnSIWeud934sd',
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const CryptoSettings = () => {
  // ** States
  const [data, setData] = useState(null)

  // ** Store Vars
  const dispatch = useDispatch()

  const cryptoCurrencyOptions = [
    { value: 'Bitcoin', label: 'Bitcoin' },
    { value: 'Etherieum', label: 'Etherieum' },
    { value: 'Ether', label: 'Ether' },
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
          cryptoCurrency: data.cryptoCurrency,
          walletAddress: data.walletAddress,
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
              <Label className='form-label' for='cryptoCurrency'>
                Crypto Currency <span className='text-danger'>*</span>
              </Label>
              <Select
                id='cryptoCurrency'
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={cryptoCurrencyOptions}
                theme={selectThemeColors}
                defaultValue={cryptoCurrencyOptions[0]}
              />
            </div>
            <div className='mb-3'>
              <Label className='form-label' for='walletAddress'>
                Crypto Wallet <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='walletAddress'
                control={control}
                render={({ field }) => (
                  <Input
                    id='walletAddress'
                    placeholder='eg. 12'
                    invalid={errors.walletAddress && true}
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

export default CryptoSettings
