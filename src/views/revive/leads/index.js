// ** React Imports
import { useEffect, useState } from 'react'

// ** Icons
import { Download } from 'react-feather'
import { IoCreateOutline } from 'react-icons/io5'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions
import { fetchBoards, fetchTasks, addBoard } from './store'

// ** Kanban Component
import UpdateTaskSidebar from './UpdateTaskSidebar'
import CreateTaskSidebar from './CreateTaskSidebar'
import KanbanBoards from './KanbanBoards'

// ** Styles
import '@styles/react/apps/app-kanban.scss'
import ImportModal from './ImportModal'

const defaultValues = {
  boardTitle: '',
}

const labelColors = {
  App: 'info',
  UX: 'success',
  Lead: 'success',
  Images: 'warning',
  Forms: 'success',
  'Code Review': 'danger',
  'Charts & Maps': 'primary',
}

const KanbanBoard = () => {
  // ** States
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddBoard, setShowAddBoard] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [createLead, setCreateLead] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector((state) => state.kanban)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  const handleAddBoardReset = () => {
    reset()
    setShowAddBoard(false)
  }

  const handleAddBoardFormSubmit = (data) => {
    dispatch(
      addBoard({
        title: data.boardTitle,
        id: data.boardTitle.toLowerCase().replace(/ /g, '-'),
      })
    )
    handleAddBoardReset()
  }

  const handleTaskSidebarToggle = () => setSidebarOpen(!sidebarOpen)

  const handleImportLeads = () => {
    setImportModal(true)
  }

  const handleCreateLeads = () => {
    setCreateLead(!createLead)
  }

  const renderBoards = () => {
    return store.boards.map((board, index) => {
      const isLastBoard = store.boards[store.boards.length - 1].id === board.id

      return (
        <KanbanBoards
          store={store}
          board={board}
          labelColors={labelColors}
          isLastBoard={isLastBoard}
          key={`${board.id}-${index}`}
          index={`${board.id}-${index}`}
          handleTaskSidebarToggle={handleTaskSidebarToggle}
        />
      )
    })
  }

  useEffect(() => {
    dispatch(fetchBoards())
    dispatch(fetchTasks())
  }, [dispatch])

  return store.boards ? (
    <div className='d-flex gap-2 flex-column w-100'>
      <div className='ms-auto '>
        <Button
          outline
          size='lg'
          color='primary'
          href='/'
          className='text-center me-2'
          onClick={(e) => {
            e.preventDefault()
            handleCreateLeads()
          }}
        >
          <IoCreateOutline size={20} /> Create Leads
        </Button>
        <Button
          size='lg'
          color='primary'
          href='/'
          className='text-center'
          onClick={(e) => {
            e.preventDefault()
            handleImportLeads()
          }}
        >
          <Download size={20} /> Import Leads
        </Button>
      </div>
      <div className='app-kanban-wrapper w-100'>
        {renderBoards()}
        <UpdateTaskSidebar
          labelColors={labelColors}
          sidebarOpen={sidebarOpen}
          selectedTask={store.selectedTask}
          handleTaskSidebarToggle={handleTaskSidebarToggle}
        />
        <CreateTaskSidebar
          labelColors={labelColors}
          sidebarOpen={createLead}
          handleTaskSidebarToggle={handleCreateLeads}
        />
        <ImportModal setShowModal={setImportModal} showModal={importModal} />
      </div>
    </div>
  ) : null
}

export default KanbanBoard
