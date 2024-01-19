// ** Mock Adapter
import mock from '../mock'

// Avatar Imports
import avatar1 from '@src/assets/images/portrait/small/avatar-s-1.jpg'
import avatar2 from '@src/assets/images/portrait/small/avatar-s-2.jpg'
import avatar3 from '@src/assets/images/portrait/small/avatar-s-3.jpg'
import avatar4 from '@src/assets/images/portrait/small/avatar-s-4.jpg'
import avatar5 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
import avatar6 from '@src/assets/images/portrait/small/avatar-s-6.jpg'

// Icons Imports
import jsIcon from '@src/assets/images/icons/file-icons/js.png'
import docIcon from '@src/assets/images/icons/file-icons/doc.png'
import pdfIcon from '@src/assets/images/icons/file-icons/pdf.png'
import txtIcon from '@src/assets/images/icons/file-icons/txt.png'

// Cover Import
import coverImage from '@src/assets/images/slider/03.jpg'

const now = new Date()
const dayAfterTomorrow = now.setDate(now.getDate() + 2)

const changeIndex = (arr, fromIndex, toIndex) => {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

const data = {
  boards: [
    {
      id: 1,
      title: 'Newly Created',
    },
    {
      id: 2,
      title: 'Converted Leads',
    },
    {
      id: 3,
      title: 'Closed Leads',
    },
  ],
}

// ------------------------------------------------
// GET: Returns Boards
// ------------------------------------------------
mock.onGet('/apps/kanban/boards').reply(() => {
  return [200, data.boards]
})

// ------------------------------------------------
// GET: Returns Tasks
// ------------------------------------------------
mock.onGet('/apps/kanban/tasks').reply(() => {
  return [200, data.tasks]
})

// ------------------------------------------------
// POST: Reorder Tasks
// ------------------------------------------------
mock.onPost('/apps/kanban/reorder-tasks').reply((config) => {
  const reOrderedTasks = JSON.parse(config.data).data

  const srcIndex = data.tasks.findIndex(
    (i) => Number(reOrderedTasks.taskId) === i.id
  )
  const targetIndex = data.tasks.findIndex(
    (i) => Number(reOrderedTasks.targetTaskId) === i.id
  )

  if (srcIndex !== -1 && targetIndex !== -1) {
    changeIndex(data.tasks, targetIndex, srcIndex)
  }

  return [200, data.tasks]
})

// ------------------------------------------------
// POST: Update Task Board
// ------------------------------------------------
mock.onPost('/apps/kanban/update-task-board').reply((config) => {
  const updatedTask = JSON.parse(config.data).data

  const task = data.tasks.find((i) => i.id === Number(updatedTask.taskId))

  task.status = updatedTask.newBoardId

  return [200, data.tasks]
})

// ------------------------------------------------
// POST: Adds Task
// ------------------------------------------------
mock.onPost('/apps/kanban/add-task').reply((config) => {
  const task = JSON.parse(config.data).data

  const { length } = data.tasks

  let lastIndex = 0

  if (length) {
    lastIndex = data.tasks[length - 1].id
  }

  task.id = lastIndex + 1

  const newTask = {
    ...task,
    labels: [],
    attachments: [],
    dueDate: dayAfterTomorrow,
    comments: [],
    assignedTo: [],
  }

  data.tasks.push(newTask)

  return [200, { newTask }]
})

// ------------------------------------------------
// POST: Adds Board
// ------------------------------------------------
mock.onPost('/apps/kanban/add-board').reply((config) => {
  const board = JSON.parse(config.data).data
  data.boards.push(board)

  return [200, { board }]
})

// ------------------------------------------------
// POST: Update Task
// ------------------------------------------------
mock.onPost('/apps/kanban/update-task').reply((config) => {
  const taskData = JSON.parse(config.data).data
  const task = data.tasks.find((task) => task.id === taskData.id)
  Object.assign(task, taskData)

  return [200, { task }]
})

// ------------------------------------------------
// Delete: Deletes Boards
// ------------------------------------------------
mock.onDelete('/apps/kanban/delete-board').reply((config) => {
  const Id = config.data

  const filteredBoards = data.boards.filter((b) => b.id !== Id)
  const filteredTasks = data.tasks.filter((t) => t.status.value !== Id)

  data.tasks = filteredTasks
  data.boards = filteredBoards

  return [200]
})

// ------------------------------------------------
// Delete: Clears Tasks
// ------------------------------------------------
mock.onDelete('/apps/kanban/clear-tasks').reply((config) => {
  const Id = config.data
  const filteredTasks = data.tasks.filter((t) => t.status.value !== Id)
  data.tasks = filteredTasks

  return [200]
})
