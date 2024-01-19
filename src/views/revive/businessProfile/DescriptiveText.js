// ** React Import
import { useState } from 'react'

// ** Custom Components

// ** Icons Import
import { BsFillSaveFill } from 'react-icons/bs'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'

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

const MailSettings = () => {
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Update Description</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <Label className='form-label' for='aboutUs'>
                About Us
              </Label>
              <Input
                type='textarea'
                name='text'
                id='aboutUs'
                rows='3'
                placeholder='About Us'
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='description'>
                Description
              </Label>
              <Input
                type='textarea'
                name='text'
                id='description'
                rows='3'
                placeholder='Description'
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='terms'>
                Terms and Conditions
              </Label>
              <Editor
                id='terms'
                editorState={termsValue}
                onEditorStateChange={(data) => setTermsValue(data)}
              />
            </div>
            <div className='mb-3'>
              <Label className='form-label' for='privacyPolicy'>
                Privacy Policy
              </Label>
              <Editor
                id='privacyPolicy'
                editorState={privacyPolicyValue}
                onEditorStateChange={(data) => setPrivacyPolicyValue(data)}
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
