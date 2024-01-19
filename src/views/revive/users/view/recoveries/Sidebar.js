// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors, marketOptions, instrumentsOptions } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'

// ** Reactstrap Imports
import { Button, Label, Form, Input, FormFeedback } from 'reactstrap'

// ** Store & Actions
import {
  addRecovery,
  addUser,
  getAllRecoveries,
  getRecoveries,
} from '../../store'
import { useDispatch } from 'react-redux'

// ** Yup
import { yupResolver } from '@hookform/resolvers/yup'
import {
  generateRandomId,
  transactionsSchema,
} from '../../../../../utility/HelperFunc'

const defaultValues = {
  company: '',
  reason: '',
  market: '',
  instruments: '',
  status: '',
  amount: undefined,
}

// ** Styles Imports
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const statusOptions = [
  { label: 'Select...', value: '' },
  { label: 'Initiated', value: 'Initiated' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Litigated', value: 'Litigated' },
  { label: 'Completed', value: 'Completed' },
]

const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

const SidebarAddNewTransaction = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null)
  const [dueDate, setDueDate] = useState(new Date())
  const { id } = useParams()

  const createdAt = new Date()

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(transactionsSchema) })

  // ** Watch for the selected market
  const selectedMarket = watch('market')
  console.log('MArket', selectedMarket)

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    try {
      setData(data)
      const { company, reason, market, instruments, status, amount } = data
      console.log('recoveries Data', data, 'Created At', createdAt)

      const recoveriesRef = doc(db, 'recoveries', id)
      await updateDoc(recoveriesRef, {
        recoveriesData: arrayUnion({
          id: generateRandomId(),
          company,
          reason,
          market: market.value,
          instruments: instruments.value,
          status: status.value,
          amount,
          createdAt,
          dueDate,
        }),
      })

      // ** Fetch All Recoveries
      dispatch(getAllRecoveries(id))
      dispatch(getRecoveries({ id }))

      toggleSidebar()

      // ** Success Toast
      toast.success((t) => (
        <ToastContent msg={'Recovery created successfully!'} />
      ))
    } catch (error) {
      // ** Error Toast
      toast.error((t) => <ToastContent msg={'Error creating Recovery!'} />)
      console.log('Error while creating recoveries', error)
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add New Transaction'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='company'>
            Company <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='company'
            control={control}
            render={({ field }) => (
              <Input
                id='company'
                placeholder='eg. Kaymbo PVT LTD'
                invalid={errors.company && true}
                {...field}
              />
            )}
          />
          {errors.company && (
            <FormFeedback>
              <div>{errors.company.message}</div>
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='reason'>
            Reason <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='reason'
            control={control}
            render={({ field }) => (
              <Input
                id='reason'
                placeholder='eg. Uncleared Trade Orders'
                invalid={errors.reason && true}
                {...field}
              />
            )}
          />
          {errors.reason && (
            <FormFeedback>
              <div>{errors.reason.message}</div>
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='amount'>
            Amount <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='amount'
            control={control}
            render={({ field }) => (
              <Input
                type='amount'
                id='amount'
                placeholder='eg. 10,000.00'
                invalid={errors.amount && true}
                {...field}
              />
            )}
          />
          {errors.amount && (
            <FormFeedback>
              <div>{errors.amount.message}</div>
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='market'>
            Market <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='market'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={marketOptions}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.status === null,
                })}
                {...field}
              />
            )}
          />
          {errors.market && (
            <FormFeedback>
              <div>{errors.market.message}</div>
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='market'>
            Instruments <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='instruments'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={instrumentsOptions(selectedMarket.value)}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.status === null,
                })}
                {...field}
              />
            )}
          />
          {errors.instruments && (
            <FormFeedback>
              <div>{errors.instruments.message}</div>
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='status'>
            Status <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={statusOptions}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.status === null,
                })}
                {...field}
              />
            )}
          />
          {errors.status && (
            <FormFeedback>
              <div>{errors.status.message}</div>
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='task-title'>
            Closed Date <span className='text-danger'>*</span>
          </Label>
          <Flatpickr
            value={dueDate}
            data-enable-time
            id='date-time-picker'
            className='form-control'
            onChange={(date) => setDueDate(date[0])}
          />
          {/* {dueDate === createdAt && dueDate.day > createdAt.day && (
            <FormFeedback>
              <div>Select a valid date</div>
            </FormFeedback>
          )} */}
        </div>
        <Button type='submit' className='me-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarAddNewTransaction
