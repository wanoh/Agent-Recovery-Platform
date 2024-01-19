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
  facebook: 'www.facebook.com',
  pineterest: 'www.pinterest.com',
  twitter: 'www.twitter.com',
  youtube: 'www.youtube.com',
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
          youtube: data.youtube,
        })
      )
    } else {
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Update Socials</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <Label className='form-label' for='facebook'>
                Facebook <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='facebook'
                control={control}
                render={({ field }) => (
                  <Input
                    id='facebook'
                    placeholder='eg. www.facebook.com'
                    invalid={errors.facebook && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='twitter'>
                Twitter <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='twitter'
                control={control}
                render={({ field }) => (
                  <Input
                    id='twitter'
                    placeholder='eg. www.twitter.com'
                    invalid={errors.twitter && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='youtube'>
                Youtube
              </Label>
              <Controller
                name='youtube'
                control={control}
                render={({ field }) => (
                  <Input
                    id='youtube'
                    placeholder='eg. www.youtube.com'
                    invalid={errors.youtube && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='pineterest'>
                Pinterest
              </Label>
              <Controller
                name='pineterest'
                control={control}
                render={({ field }) => (
                  <Input
                    id='pineterest'
                    placeholder='eg. www.pinterest.com'
                    invalid={errors.pineterest && true}
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

export default MailSettings
