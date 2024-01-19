// ** React Imports
import { useEffect, useState } from 'react'

// ** Reactstrap Imports
import {
  Badge,
  Modal,
  ModalBody,
  Button,
  Form,
  Input,
  Label,
  FormFeedback,
} from 'reactstrap'

// ** Redux Imports
import { useDispatch } from 'react-redux'

// ** Actions
import { fetchTasks } from './store'

// ** Third Party Components
import { X } from 'react-feather'
import Select, { components } from 'react-select' //eslint-disable-line
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Flatpickr from 'react-flatpickr'

// ** Random ID
import { generateRandomId } from '../../../utility/HelperFunc'

// ** Styles Imports
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/file-uploader/file-uploader.scss'

// ** Firebase imports
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../../configs/firebase'

const statusOptions = [
  { label: 'Select...', value: '' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
]

const TaskSidebar = (props) => {
  // ** Props
  const { sidebarOpen, handleTaskSidebarToggle } = props

  // ** State
  const [closedDate, setClosedDate] = useState(new Date())

  const createdAt = new Date()

  // ** Hooks
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      leadQuality: '',
      depositAmount: 0.0,
      notes: '',
    },
  })

  const onSubmit = async (data) => {
    const {
      fullName,
      email,
      phone,
      country,
      notes,
      depositAmount,
      leadQuality,
    } = data

    const userID = generateRandomId()
    const leadCloseStatus = false
    const status = {
      label: 'Created',
      value: 1, // ** 1. Created 2. Converted 3. Closed
    }
    try {
      const leadData = {
        userID,
        fullName,
        email,
        phone,
        country,
        createdAt,
        source: 2, // ** 1. imported lead 2. lead created by Admin
        status,
        depositAmount,
        leadQuality: leadQuality.value,
        notes,
        closedDate,
        leadCloseStatus,
      }

      console.log('Lead Data', leadData)

      const leadRef = doc(db, 'leads', userID)
      await setDoc(leadRef, leadData)
      dispatch(fetchTasks())
      handleTaskSidebarToggle()
    } catch (error) {
      console.log('Error creating leads', error)
    }
  }

  return (
    <Modal
      isOpen={sidebarOpen}
      className='sidebar-lg'
      contentClassName='p-0'
      toggle={handleTaskSidebarToggle}
      modalClassName='modal-slide-in sidebar-kanban-modal'
    >
      <Form
        id='form-modal-kanban'
        className='kanban-task-modal'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='modal-header d-flex align-items-center justify-content-between mb-1'>
          <h5 className='modal-title'>Create Lead</h5>
          <X
            className='fw-normal mt-25'
            size={16}
            onClick={handleTaskSidebarToggle}
          />
        </div>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Full Name <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='fullName'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-title'
                    placeholder='Name'
                    className='new-todo-item-title'
                    invalid={errors.fullName && true}
                    {...field}
                  />
                )}
              />
              {errors.fullName && (
                <FormFeedback>Please enter a valid task title</FormFeedback>
              )}
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Email <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-email'
                    placeholder='Email'
                    className='new-todo-item-title'
                    invalid={errors.email && true}
                    {...field}
                  />
                )}
              />
              {errors.phone && (
                <FormFeedback>Please enter a valid email</FormFeedback>
              )}
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Phone <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-phone'
                    placeholder='Phone number'
                    className='new-todo-item-title'
                    invalid={errors.phone && true}
                    {...field}
                  />
                )}
              />
              {errors.phone && (
                <FormFeedback>Please enter a valid phone number</FormFeedback>
              )}
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Country <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-country'
                    placeholder='Country'
                    className='new-todo-item-title'
                    invalid={errors.country && true}
                    {...field}
                  />
                )}
              />
              {errors.phone && (
                <FormFeedback>Please enter a valid Country</FormFeedback>
              )}
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Lead Quality <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='leadQuality'
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    classNamePrefix='select'
                    options={statusOptions}
                    {...field}
                  />
                )}
              />
              {errors.leadQuality && (
                <FormFeedback>Please Select a Lead Quality</FormFeedback>
              )}
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Deposit Amount <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='depositAmount'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-broker'
                    placeholder='Deposit Amount'
                    className='new-todo-item-title'
                    invalid={errors.depositAmount && true}
                    {...field}
                  />
                )}
              />
              {errors.phone && (
                <FormFeedback>Please enter a valid Amount</FormFeedback>
              )}
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='status'>
                Notes <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='notes'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='Notes'
                    invalid={errors.notes && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Closed Date <span className='text-danger'>*</span>
              </Label>
              <Flatpickr
                value={closedDate}
                data-enable-time
                id='date-time-picker'
                className='form-control'
                onChange={(date) => setClosedDate(date[0])}
              />
            </div>

            <div>
              <Button type='submit' color='primary' className='me-1'>
                Create Lead
              </Button>
            </div>
          </ModalBody>
        </PerfectScrollbar>
      </Form>
    </Modal>
  )
}

export default TaskSidebar
