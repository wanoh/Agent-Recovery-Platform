// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllData, getData } from '../../users/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import { ChevronDown, User } from 'react-feather'

// ** Reactstrap Imports
import { Card, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ store, toggleSidebar }) => {
  return (
    <div className='d-flex align-items-end m-1'>
      <Button
        className='add-new-user text-nowrap'
        color='primary'
        onClick={toggleSidebar}
      >
        Add New Agent
      </Button>
    </div>
  )
}

const AgentsList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.users)

  // ** States
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    dispatch(getAllData())
    dispatch(
      getData({
        perPage: rowsPerPage,
      })
    )
  }, [dispatch, store.data.length])

  // ** Table data to render
  const dataToRender = () => {
    const filters = {}

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data.filter((user) => user.role === 'agent')
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData
        .filter((user) => user.role === 'agent')
        .slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            responsive
            columns={columns(store)}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader store={store} toggleSidebar={toggleSidebar} />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default AgentsList
