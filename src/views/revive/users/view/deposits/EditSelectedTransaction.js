// ** React Import
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { useParams } from 'react-router-dom'
import { getAllTransactions, getTransactions } from '../../store'
import toast from 'react-hot-toast'

const statusOptions = [
  { label: 'Select...', value: '' },
  { label: 'Requested', value: 'Requested' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Declined', value: 'Declined' },
]

const typeOptions = [
  { label: 'Select...', value: '' },
  { label: 'Withdrawal', value: 'Withdrawal' },
  { label: 'Deposit', value: 'Deposit' },
]

const methodOptions = [
  { label: 'Select...', value: '' },
  { label: 'Bank', value: 'Bank' },
  { label: 'Paypal', value: 'Paypal' },
  { label: 'Credit', value: 'Credit' },
  { label: 'Crypto Currency', value: 'Crypto Currency' },
]

const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

const EditSelectedTransaction = ({ open, toggleSidebar, selectedRowData }) => {
  // ** Default Values from the selected row
  useEffect(() => {
    if (selectedRowData) {
      setValue('amount', selectedRowData.amount)
      setValue(
        'type',
        selectedRowData.type
          ? { label: selectedRowData.type, value: selectedRowData.type }
          : { label: 'Select...', value: '' }
      )
      setValue(
        'method',
        selectedRowData.method
          ? {
              label: selectedRowData.method,
              value: selectedRowData.method,
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

  // ** Store Vars
  const dispatch = useDispatch()

  const { id } = useParams()

  // ** Vars
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    console.log('Edit Transaction Data', data)
    const transactionsRef = doc(db, 'transactions', id)
    try {
      const { amount, type, method, status } = data

      const doc = await getDoc(transactionsRef)

      if (doc.exists) {
        const newArray = doc.data().transactionsData.map((item) => {
          if (item.id === selectedRowData.id) {
            return {
              ...item,
              id: selectedRowData.id,
              method: method.value,
              type: type.value,
              status: status.value,
              amount,
            }
          }
          return item
        })

        await updateDoc(transactionsRef, { transactionsData: newArray })

        // ** Fetch All Recoveries
        dispatch(getAllTransactions(id))
        dispatch(getTransactions({ id }))

        toggleSidebar()

        // ** Success Toast
        toast.success((t) => (
          <ToastContent msg={'Transaction successfully updated!'} />
        ))
      } else {
        console.log('Transaction not found!')
        toast.error((t) => <ToastContent msg={'Transaction not found!'} />)
      }
    } catch (error) {
      // ** Error Toast
      toast.error((t) => <ToastContent msg={'Error Updating Transaction!'} />)
      console.log('Error while updating transaction', error)
    }
  }

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
          <Label className='form-label' for='type'>
            Type <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={typeOptions}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.type === null,
                })}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='method'>
            Method <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='method'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={methodOptions}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.method === null,
                })}
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
                type='number'
                id='amount'
                placeholder='eg. 10,000.00'
                invalid={errors.amount && true}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
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

export default EditSelectedTransaction
