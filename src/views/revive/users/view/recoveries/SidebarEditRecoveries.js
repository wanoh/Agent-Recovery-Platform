// ** React Import
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors, marketOptions, instrumentsOptions } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

// ** Reactstrap Imports
import { Button, Label, Form, Input } from 'reactstrap'

// ** Store & Actions
import { addUser, getAllRecoveries, getRecoveries } from '../../store'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import toast from 'react-hot-toast'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { useParams } from 'react-router-dom'

const statusOptions = [
  { label: 'Select...', value: '' },
  { label: 'Initiated', value: 'Initiated' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Litigated', value: 'Litigated' },
  { label: 'Completed', value: 'Completed' },
]

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === 'object' ? field !== null : field.length > 0
  )
}

const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

const SidebarEditTransaction = ({ open, toggleSidebar, selectedRowData }) => {
  // ** Default Values from the selected row
  useEffect(() => {
    if (selectedRowData) {
      setValue('company', selectedRowData.company || '')
      setValue('reason', selectedRowData.reason || '')
      setValue('amount', selectedRowData.amount || '')
      setValue(
        'market',
        selectedRowData.market
          ? { label: selectedRowData.market, value: selectedRowData.market }
          : { label: 'Select...', value: '' }
      )
      setValue(
        'instruments',
        selectedRowData.instruments
          ? {
              label: selectedRowData.instruments,
              value: selectedRowData.instruments,
            }
          : { label: 'Select...', value: '' }
      )
      setValue(
        'status',
        selectedRowData.status
          ? {
              label: selectedRowData.status,
              value: selectedRowData.status,
            }
          : { label: 'Select...', value: '' }
      )
    }
  }, [selectedRowData])
  // ** States
  const [data, setData] = useState(null)
  const [dueDate, setDueDate] = useState(null)
  console.log(
    moment(selectedRowData?.dueDate?.seconds * 1000).format('YYYY-MM-DD HH:mm')
  )
  // ** Store Vars
  const dispatch = useDispatch()

  const { id } = useParams()

  // ** Vars
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // ** Watch for the selected market
  const selectedMarket = watch('market')
  console.log('selectedMarket', selectedMarket)
  const instrumentsSwitch = () => {
    if (selectedRowData.market !== selectedMarket?.value) {
      return selectedMarket?.value
    } else {
      return selectedRowData.market
    }
  }

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    const recoveryRef = doc(db, 'recoveries', id)
    try {
      // setData(data)
      const { company, reason, market, instruments, status, amount } = data

      const doc = await getDoc(recoveryRef)

      if (doc.exists) {
        const newArray = doc.data().recoveriesData.map((item) => {
          if (item.id === selectedRowData.id) {
            return {
              ...item,
              id: selectedRowData.id,
              company,
              reason,
              market: market.value,
              instruments: instruments.value,
              status: status.value,
              amount,
              dueDate: dueDate === null ? selectedRowData.dueDate : dueDate,
            }
          }
          return item
        })

        await updateDoc(recoveryRef, { recoveriesData: newArray })

        // ** Fetch All Recoveries
        dispatch(getAllRecoveries(id))
        dispatch(getRecoveries({ id }))

        toggleSidebar()

        // ** Success Toast
        toast.success((t) => (
          <ToastContent msg={'Recovery successfully updated!'} />
        ))
      } else {
        console.log('Document not found!')
        toast.error((t) => <ToastContent msg={'Document not found!'} />)
      }
    } catch (error) {
      // ** Error Toast
      toast.error((t) => <ToastContent msg={'Error Updating Recovery!'} />)
      console.log('Error while updating recoveries', error)
    }
  }

  console.log('selectedRowData', selectedRowData)
  return (
    <Sidebar
      size='lg'
      open={open}
      title='Edit Transaction'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
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
              <Input id='company' invalid={errors.company && true} {...field} />
            )}
          />
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
                type='text'
                id='reason'
                invalid={errors.reason && true}
                {...field}
              />
            )}
          />
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
                options={instrumentsOptions(instrumentsSwitch())}
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
          <Label className='form-label' for='task-title'>
            Closed Date <span className='text-danger'>*</span>
          </Label>
          <Flatpickr
            value={dueDate}
            data-enable-time
            placeholder={moment(
              selectedRowData?.dueDate?.seconds * 1000
            ).format('YYYY-MM-DD HH:mm')}
            id='date-time-picker'
            className='form-control'
            onChange={(date) => setDueDate(date[0])}
          />
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

export default SidebarEditTransaction
