// ** React Import
import { useState } from 'react'

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
import { addUser, getAllTransactions, getTransactions } from '../../store'
import { useDispatch } from 'react-redux'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { generateRandomId } from '../../../../../utility/HelperFunc'

const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

const defaultValues = {
  method: '',
  amount: '',
}

const methodOptions = [
  { label: 'Select...', value: '' },
  { label: 'Bank', value: 'Bank' },
  { label: 'Paypal', value: 'Paypal' },
  { label: 'Credit', value: 'Credit' },
  { label: 'Crypto Currency', value: 'Crypto Currency' },
]

const SidebarWithdrawal = ({ open, toggleSidebar }) => {
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
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    setData(data)
    console.log('Data from Withdrawal Transaction', data)
    const { method, amount } = data
    const createdAt = new Date()
    const createdBy = 'admin'
    const status = 'Approved'
    const type = 'Withdrawal'
    try {
      const withdrawalRef = doc(db, 'transactions', id)
      await updateDoc(withdrawalRef, {
        transactionsData: arrayUnion({
          id: generateRandomId(),
          userId: id,
          type,
          method: method.value,
          status,
          amount,
          createdAt,
          createdBy,
        }),
      })

      // ** Fetch All Recoveries
      dispatch(getAllTransactions(id))
      dispatch(getTransactions({ id }))

      toggleSidebar()

      // ** Success Toast
      toast.success((t) => (
        <ToastContent msg={'Transaction created successfully!'} />
      ))
    } catch (error) {
      // ** Error Toast
      toast.error((t) => <ToastContent msg={'Error creating Transaction!'} />)
      console.log('Error while creating transaction', error)
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

export default SidebarWithdrawal
