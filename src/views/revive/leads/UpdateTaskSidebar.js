// ** React Imports
import { useState } from 'react'

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

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { X, DownloadCloud } from 'react-feather'
import Select, { components } from 'react-select' //eslint-disable-line
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Actions
import store, { updateTask, handleSelectTask } from './store'

// ** Utils
import { isObjEmpty, selectThemeColors } from '@utils'

// ** Styles Imports
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/file-uploader/file-uploader.scss'

const leadQualityOptions = [
  { label: 'Select...', value: '' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
]
const statusOptions = [
  { label: 'Select...', value: '' },
  { label: 'Created', value: 1 },
  { label: 'Converted', value: 2 },
  { label: 'Closed', value: 3 },
]

const TaskSidebar = (props) => {
  // ** Props
  const { sidebarOpen, selectedTask, handleTaskSidebarToggle } = props

  // ** State
  const [dueDate, setDueDate] = useState(new Date())
  const [assignedTo, setAssignedTo] = useState(null)

  // ** Hooks
  const dispatch = useDispatch()

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status,
      fullName: '',
      email: '',
      phone: '',
      country: '',
      leadQuality: '',
      depositAmount: 0.0,
      notes: '',
    },
  })

  // ** Function to run when sidebar opens
  const handleSidebarOpened = () => {
    if (!isObjEmpty(selectedTask)) {
      setValue('fullName', selectedTask.fullName)
      setValue('email', selectedTask.email)
      setValue('phone', selectedTask.phone)
      setValue('country', selectedTask.country)
      setValue('notes', selectedTask.notes)
      setValue('depositAmount', selectedTask.depositAmount)
      setValue(
        'leadQuality',
        selectedTask.leadQuality ? selectedTask.leadQuality : ''
      )
      setValue(
        'status',
        selectedTask.status
          ? {
              label: selectedTask.status.label,
              value: selectedTask.status.value,
            }
          : { label: 'Select...', value: '' }
      )
    }
  }

  // ** Function to run when sidebar closes
  const handleSidebarClosed = () => {
    setDueDate(new Date())
    dispatch(handleSelectTask({}))
    setAssignedTo(null)
  }

  const onSubmit = (data) => {
    console.log({ ...selectedTask, ...data }, 'Data from Update Slide')
    dispatch(
      updateTask({
        ...selectedTask,
        ...data,
      })
    )
    handleTaskSidebarToggle()
  }

  const handleResetFields = () => {
    setValue('fullName', selectedTask.fullName)
    setValue('email', selectedTask.email)
    setValue('phone', selectedTask.phone)
    setValue('country', selectedTask.country)
    setValue('notes', selectedTask.notes)
    setValue('depositAmount', selectedTask.depositAmount)
    setValue(
      'leadQuality',
      selectedTask.leadQuality
        ? {
            label: selectedTask.leadQuality,
            value: selectedTask.leadQuality,
          }
        : { label: 'Select...', value: '' }
    )
    setValue(
      'status',
      selectedTask.status
        ? {
            label: selectedTask.status.label,
            value: selectedTask.status.value,
          }
        : { label: 'Select...', value: '' }
    )
  }

  return (
    <Modal
      isOpen={sidebarOpen}
      className='sidebar-lg'
      contentClassName='p-0'
      onOpened={handleSidebarOpened}
      onClosed={handleSidebarClosed}
      toggle={handleTaskSidebarToggle}
      modalClassName='modal-slide-in sidebar-kanban-modal'
    >
      <Form
        id='form-modal-kanban'
        className='kanban-task-modal'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='modal-header d-flex align-items-center justify-content-between mb-1'>
          <h5 className='modal-title'>
            {selectedTask?.status?.value === 3 ? 'Update Lead' : 'Lead Preview'}
          </h5>
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
                    placeholder='Full Name'
                    className='new-todo-item-title'
                    invalid={errors.fullName && true}
                    {...field}
                  />
                )}
              />
              {errors.fullName && (
                <FormFeedback>Please enter a name</FormFeedback>
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
                Deposit Amount <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='depositAmount'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-language'
                    placeholder='Deposit Amount'
                    className='new-todo-item-title'
                    invalid={errors.depositAmount && true}
                    {...field}
                  />
                )}
              />
              {errors.depositAmount && (
                <FormFeedback>Please enter a valid amount</FormFeedback>
              )}
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='status'>
                Lead Quality <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='leadQuality'
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    classNamePrefix='select'
                    options={leadQualityOptions}
                    {...field}
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
                    {...field}
                  />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='task-title'>
                Notes <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='notes'
                control={control}
                render={({ field }) => (
                  <Input
                    id='task-funnel'
                    placeholder='Notes'
                    className='new-todo-item-title'
                    invalid={errors.notes && true}
                    {...field}
                  />
                )}
              />
              {errors.notes && <FormFeedback>Please enter a note</FormFeedback>}
            </div>

            <div>
              {selectedTask?.status?.value !== 3 && (
                <>
                  <Button type='submit' color='primary' className='me-1'>
                    Update
                  </Button>
                  <Button outline color='secondary' onClick={handleResetFields}>
                    Reset
                  </Button>
                </>
              )}
              {selectedTask?.status?.value === 3 && (
                <Button color='primary' className='me-1'>
                  Create Account
                </Button>
              )}
            </div>
          </ModalBody>
        </PerfectScrollbar>
      </Form>
    </Modal>
  )
}

export default TaskSidebar
