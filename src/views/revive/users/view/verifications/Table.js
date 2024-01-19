// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Sidebar
import Sidebar from './Sidebar'
import PreviewBar from './PreviewVertical'

// ** Preview Data
import { data } from './data'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllData, getData } from '../../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Row, Col, Card, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  searchTerm,
  handleFilter,
}) => {
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='p-0 mb-0'>
          <h4>Verification</h4>
        </Col>
      </Row>
    </div>
  )
}

const customStyles = {
  rows: {
    style: {
      padding: '20px',
    },
  },
}

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.users)
  const togglePreviewBar = () => setPreviewSliderState(!previewSliderState)

  // ** Handle Edit Click Func
  const previewDetails = (row) => {
    setSelectedRowData(row)
    togglePreviewBar()
  }

  // ** State to store row data
  const [selectedRowData, setSelectedRowData] = useState(null)

  const [previewSliderState, setPreviewSliderState] = useState(false)
  // ** States
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentType, setCurrentType] = useState({
    value: '',
    label: 'Select Type',
  })
  const [currentPlan, setCurrentPlan] = useState({
    value: '',
    label: 'Select Plan',
  })
  const [currentStatus, setCurrentStatus] = useState({
    value: '',
    label: 'Select Status',
    number: 0,
  })

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    dispatch(getAllData())
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        role: currentType.value,
        status: currentStatus.value,
        currentPlan: currentPlan.value,
      })
    )
  }, [dispatch, store.data.length, sort, sortColumn, currentPage])

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
        role: currentType.value,
        status: currentStatus.value,
        currentPlan: currentPlan.value,
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: value,
        page: currentPage,
        role: currentType.value,
        currentPlan: currentPlan.value,
        status: currentStatus.value,
      })
    )
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val)
    dispatch(
      getData({
        sort,
        q: val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        role: currentType.value,
        status: currentStatus.value,
        currentPlan: currentPlan.value,
      })
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      role: currentType.value,
      currentPlan: currentPlan.value,
      status: currentStatus.value,
      q: searchTerm,
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data.slice(0, 5)
    } else {
      return store.allData.slice(0, 5)
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        role: currentType.value,
        status: currentStatus.value,
        currentPlan: currentPlan.value,
      })
    )
  }

  return (
    <Fragment>
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            responsive
            paginationServer
            customStyles={customStyles}
            columns={columns(previewDetails)}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <PreviewBar
        open={previewSliderState}
        toggleSidebar={togglePreviewBar}
        data={data}
        title={selectedRowData?.proof}
        docType={data[0].imgName}
        selectedRowData={selectedRowData}
      />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default UsersList
