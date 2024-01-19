// ** React Import
import { useEffect, useState } from 'react'

// ** Icons Import
import { BsFillSaveFill } from 'react-icons/bs'

// ** Third Party Components
import { useForm } from 'react-hook-form'
import { EditorState } from 'draft-js'
import timezoneJS from 'moment-timezone'

// ** Utils
import { selectThemeColors } from '@utils'

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

// ** Store & Actions
import { useDispatch } from 'react-redux'
import Select from 'react-select'

const defaultValues = {
  aboutUs: '',
  description: '',
  terms: '',
  privacyPolicy: '',
}

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const Utilities = () => {
  // ** States
  const [data, setData] = useState(null)
  const [termsValue, setTermsValue] = useState(EditorState.createEmpty())
  const [privacyPolicyValue, setPrivacyPolicyValue] = useState(
    EditorState.createEmpty()
  )

  // ** Store Vars
  const dispatch = useDispatch()

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

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'dutch', label: 'Dutch' },
  ]

  const currencyOptions = [
    { value: 'usd', label: 'USD' },
    { value: 'euro', label: 'Euro' },
    { value: 'pound', label: 'Pound' },
    { value: 'bitcoin', label: 'Bitcoin' },
  ]

  const DefaultTimeZoneOptions = [
    {
      value: '(GMT-12:00) International Date Line West',
      label: '(GMT-12:00) International Date Line West',
    },
    {
      value: '(GMT-11:00) Midway Island, Samoa',
      label: '(GMT-11:00) Midway Island, Samoa',
    },
    { value: '(GMT-10:00) Hawaii', label: '(GMT-10:00) Hawaii' },
    { value: '(GMT-09:00) Alaska', label: '(GMT-09:00) Alaska' },
    {
      value: '(GMT-08:00) Pacific Time (US & Canada)',
      label: '(GMT-08:00) Pacific Time (US & Canada)',
    },
    {
      value: '(GMT-08:00) Tijuana, Baja California',
      label: '(GMT-08:00) Tijuana, Baja California',
    },
    { value: '(GMT-07:00) Arizona', label: '(GMT-07:00) Arizona' },
    {
      value: '(GMT-07:00) Chihuahua, La Paz, Mazatlan',
      label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan',
    },
    {
      value: '(GMT-07:00) Mountain Time (US & Canada)',
      label: '(GMT-07:00) Mountain Time (US & Canada)',
    },
    {
      value: '(GMT-06:00) Central America',
      label: '(GMT-06:00) Central America',
    },
    {
      value: '(GMT-06:00) Central Time (US & Canada)',
      label: '(GMT-06:00) Central Time (US & Canada)',
    },
    {
      value: '(GMT-06:00) Guadalajara, Mexico City, Monterrey',
      label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey',
    },
    { value: '(GMT-06:00) Saskatchewan', label: '(GMT-06:00) Saskatchewan' },
    {
      value: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco',
      label: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco',
    },
    {
      value: '(GMT-05:00) Eastern Time (US & Canada)',
      label: '(GMT-05:00) Eastern Time (US & Canada)',
    },
    {
      value: '(GMT-05:00) Indiana (East)',
      label: '(GMT-05:00) Indiana (East)',
    },
    {
      value: '(GMT-04:00) Atlantic Time (Canada)',
      label: '(GMT-04:00) Atlantic Time (Canada)',
    },
    {
      value: '(GMT-04:00) Caracas, La Paz',
      label: '(GMT-04:00) Caracas, La Paz',
    },
    { value: '(GMT-04:00) Manaus', label: '(GMT-04:00) Manaus' },
    { value: '(GMT-04:00) Santiago', label: '(GMT-04:00) Santiago' },
    { value: '(GMT-03:30) Newfoundland', label: '(GMT-03:30) Newfoundland' },
  ]

  // Get an array of all timezones using moment-timezone
  const allTimezones = timezoneJS.tz.names()

  const timeZoneOptions = allTimezones.reduce((options, timezone) => {
    options[timezone] = timezone
    return options
  }, {})

  const timeZoneOptionsArray = Object.keys(timeZoneOptions).map((timezone) => ({
    value: timezone,
    label: `(${timezoneJS.tz(timezone).format('Z')}) ${timezone}`,
  }))

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Utilities</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='mb-1'>
              <Col sm='6'>
                <Label className='form-label' for='language'>
                  Language
                </Label>
                <Select
                  id='language'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={languageOptions}
                  theme={selectThemeColors}
                  defaultValue={languageOptions[0]}
                />
              </Col>
              <Col sm='6'>
                <Label className='form-label' for='currency'>
                  Currency
                </Label>
                <Select
                  id='currency'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={currencyOptions}
                  theme={selectThemeColors}
                  defaultValue={currencyOptions[0]}
                />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Label className='form-label' for='timeZone'>
                Timezone
              </Label>
              <Select
                id='timeZone'
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={timeZoneOptionsArray}
                theme={selectThemeColors}
                defaultValue={timeZoneOptionsArray[0]}
              />
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

export default Utilities
