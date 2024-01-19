// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Firebase Imports
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../../../configs/firebase'

// ** Axios Imports
import axios from 'axios'
import { date } from 'yup'

// ** Fetch Boards
export const fetchBoards = createAsyncThunk(
  'appKanban/fetchBoards',
  async () => {
    const response = await axios.get('/apps/kanban/boards')

    return response.data
  }
)

export const fetchTasks = createAsyncThunk(
  'appKanban/fetchTasks',
  async (_, thunkAPI) => {
    try {
      const leadsCollectionRef = collection(db, 'leads')
      const leadsSnapshot = await getDocs(leadsCollectionRef)

      if (!leadsSnapshot.empty) {
        const data = leadsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        console.log('Firebase data', data)
        return data // This data will be the payload of the fulfilled action
      } else {
        console.log('No documents found in "leads" collection.')
        return []
      }
    } catch (error) {
      console.error('Error getting documents: ', error.message)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const updateTask = createAsyncThunk(
  'appKanban/updateTask',
  async (data, { dispatch }) => {
    const leadsCollectionRef = collection(db, 'leads')
    const leadRef = doc(leadsCollectionRef, data.id)
    const updateObject = {}

    const fieldsToUpdate = [
      'status',
      'fullName',
      'email',
      'phone',
      'depositAmount',
      'leadQuality',
      'notes',
      'leadCloseStatus',
    ]

    // Loop through fields and add them to the updateObject if they have a valid value
    fieldsToUpdate.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        updateObject[field] =
          field === 'status'
            ? { value: data[field].value, label: data[field].label }
            : data[field]
      }
    })

    await updateDoc(leadRef, updateObject)

    await dispatch(fetchTasks())

    // return response.data
  }
)

export const addBoard = createAsyncThunk(
  'appKanban/addBoard',
  async (data, { dispatch }) => {
    const response = await axios.post('/apps/kanban/add-board', { data })
    await dispatch(fetchBoards())
    await dispatch(fetchTasks())

    return response.data
  }
)

export const addTask = createAsyncThunk(
  'appKanban/addTask',
  async (data, { dispatch }) => {
    const response = await axios.post('/apps/kanban/add-task', { data })
    await dispatch(fetchBoards())
    await dispatch(fetchTasks())

    return response.data
  }
)

export const clearTasks = createAsyncThunk(
  'appKanban/clearTasks',
  async (id, { dispatch }) => {
    const response = await axios.delete('/apps/kanban/clear-tasks', {
      data: id,
    })

    await dispatch(fetchBoards())
    await dispatch(fetchTasks())

    return response
  }
)

export const updateTaskBoard = createAsyncThunk(
  'appKanban/updateTaskBoard',
  async (data, { dispatch }) => {
    const response = await axios.post('/apps/kanban/update-task-board', {
      data,
    })
    await dispatch(fetchBoards())
    await dispatch(fetchTasks())

    return response.data
  }
)

export const reorderTasks = createAsyncThunk(
  'appKanban/reorder-tasks',
  async (data, { dispatch }) => {
    const response = await axios.post('/apps/kanban/reorder-tasks', { data })
    await dispatch(fetchBoards())
    await dispatch(fetchTasks())

    return response.data
  }
)

export const deleteBoard = createAsyncThunk(
  'appKanban/deleteBoard',
  async (id, { dispatch }) => {
    const response = await axios.delete('/apps/kanban/delete-board', {
      data: id,
    })

    await dispatch(fetchBoards())
    await dispatch(fetchTasks())

    return response
  }
)

export const appKanbanSlice = createSlice({
  name: 'appKanban',
  initialState: {
    tasks: [],
    boards: [],
    selectedTask: null,
  },
  reducers: {
    handleSelectTask: (state, action) => {
      state.selectedTask = action.payload
      console.log('Selected Task', action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload
      })
  },
})

export const { handleSelectTask } = appKanbanSlice.actions

export default appKanbanSlice.reducer
