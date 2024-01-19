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
  Label,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
} from 'reactstrap'

// ** Third Party Components
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { useParams } from 'react-router-dom'
import { generateRandomId } from '../../../../../utility/HelperFunc'
import { getSalesReport } from '../../store'
import toast from 'react-hot-toast'
import { ToastContent } from '../../../../../utility/Utils'

const SalesReportSettings = () => {
  // ** States
  const [pending, setPending] = useState(false)

  // ** Params
  const { id } = useParams()

  // ** Store Vars
  const dispatch = useDispatch()

  const callStatusOptions = [
    { value: 'NoAnswer', label: 'No Answer' },
    { value: 'FirstAnswer', label: 'Answer on first ring' },
    { value: 'SecondAnswer', label: 'Answer on second ring' },
    { value: 'NumberBusy', label: 'Number Busy' },
    { value: 'OutOfReach', label: 'Out Of Reach' },
    { value: 'PickAndEnd', label: 'Pick up and ended the call' },
  ]
  const salesStatusOptions = [
    { value: 'NoInterested', label: 'No Interested' },
    { value: 'moreInfo', label: 'Need More Information' },
    { value: 'noIdeaInterested', label: 'Has no idea and interested' },
    { value: 'noIdeaUninterested', label: 'Has no idea and not interested' },
    { value: 'requestCallback', label: 'Request a callback' },
  ]
  const salesClosingStatusOptions = [
    { value: 'RDx1', label: 'Retention Deportation x1' },
    { value: 'RDx2', label: 'Retention Deportation x4' },
    { value: 'RDx3', label: 'Retention Deportation x3' },
    { value: 'RDx4', label: 'Retention Deportation x4' },
  ]

  // ** Vars
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      callStatus: '',
      salesStatus: '',
      salesClosingStatus: '',
      notes: '',
    },
  })

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    console.log('Sales Report Data', data)
    const { callStatus, salesStatus, salesClosingStatus, notes } = data

    const createdAt = new Date()
    const createdBy = 'admin'

    setPending(true)
    try {
      const salesReportRef = doc(db, 'userSalesReport', id)

      await updateDoc(salesReportRef, {
        salesReportData: arrayUnion({
          id: generateRandomId(),
          callStatus: callStatus.value,
          salesStatus: salesStatus.value,
          salesClosingStatus: salesClosingStatus.value,
          notes,
          createdBy,
          createdAt,
        }),
      })

      // ** Fetch All Sales Report
      dispatch(getSalesReport(id))

      // ** Success Toast
      toast.success((t) => (
        <ToastContent msg={'Sales Report created successfully!'} />
      ))

      reset()
      setPending(false)
    } catch (error) {
      setPending(false)
      reset()

      // ** Error Toast
      toast.error((t) => <ToastContent msg={'Error creating Sales Report'} />)

      console.log('Error Saving Sales Report', error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sales Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <Label className='form-label' for='callStatus'>
                Last Call Status <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='callStatus'
                id='callStatus'
                control={control}
                render={({ field }) => (
                  <Select
                    id='callStatus'
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    options={callStatusOptions}
                    theme={selectThemeColors}
                    {...field}
                  />
                )}
              />
            </div>

            <div className='mb-2'>
              <Label className='form-label' for='salesStatus'>
                Sales Status <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='salesStatus'
                id='salesStatus'
                control={control}
                render={({ field }) => (
                  <Select
                    id='salesStatus'
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    options={salesStatusOptions}
                    theme={selectThemeColors}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-2'>
              <Label className='form-label' for='salesClosingStatus'>
                Sales Closing Status <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='salesClosingStatus'
                id='salesClosingStatus'
                control={control}
                render={({ field }) => (
                  <Select
                    id='salesClosingStatus'
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    options={salesClosingStatusOptions}
                    theme={selectThemeColors}
                    {...field}
                  />
                )}
              />
            </div>

            <div className='mb-2'>
              <Label className='form-label' for='notes'>
                Notes <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='notes'
                control={control}
                render={({ field }) => (
                  <Input
                    id='notes'
                    type='textarea'
                    rows='3'
                    placeholder='Notes'
                    disabled={pending}
                    invalid={errors.notes && true}
                    {...field}
                  />
                )}
              />
            </div>

            <Button
              type='submit'
              className='w-100 mt-2'
              color='primary'
              disabled={pending}
            >
              {pending && <Spinner className='me-1' color='light' size='sm' />}
              <BsFillSaveFill size={16} className='me-1' />
              Save
            </Button>
          </Form>
        </CardBody>
      </Card>
    </>
  )
}

export default SalesReportSettings
