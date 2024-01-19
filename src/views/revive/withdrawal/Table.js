// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'
import EditSidebar from './EditSelectedTransaction'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllUsersTransactions, getUsersTransactions } from '../users/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ handlePerPage, rowsPerPage }) => {
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <label htmlFor='rows-per-page'>Entries</label>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const DepositList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.users)
  const agentAuth = useSelector((state) => state.auth.userData)

  const toggleEditSidebar = () => setEditSliderState(!editSliderState)

  // ** Handle Edit Click Func
  const handleEditClick = (row) => {
    setSelectedRowData(row)
    toggleEditSidebar()
  }

  // ** State for storing Selected Row Data
  const [editSliderState, setEditSliderState] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState(null)

  // ** States
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(10)
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
    dispatch(getAllUsersTransactions(agentAuth))
    dispatch(getUsersTransactions(agentAuth))
  }, [
    dispatch,
    store.usersTransactionsData.length,
    sort,
    sortColumn,
    currentPage,
  ])

  // ** User filter options
  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'bank', label: 'Bank' },
    { value: 'paypal', label: 'Paypal' },
    { value: 'creditCard', label: 'Credit Card' },
    { value: 'cryptoCurrency', label: 'Crypto Currency' },
  ]

  const statusOptions = [
    { value: '', label: 'Select Status', number: 0 },
    { value: 'new', label: 'New', number: 1 },
    { value: 'approved', label: 'Approved', number: 2 },
    { value: 'declined', label: 'Declined', number: 3 },
  ]

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getUsersTransactions({
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
      getUsersTransactions({
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
      getUsersTransactions({
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

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.totalUsersTransactions / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={
          'pagination react-paginate justify-content-end my-2 pe-1'
        }
      />
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

    if (store.usersTransactionsData.length > 0) {
      return store.usersTransactionsData.filter(
        (transaction) => transaction.type === 'Withdrawal'
      )
    } else if (store.usersTransactionsData.length === 0 && isFiltered) {
      return []
    } else {
      return store.allUsersTransactionsData
        .filter((transaction) => transaction.type === 'Withdrawal')
        .slice(0, rowsPerPage)
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getUsersTransactions({
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
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filters</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='6'>
              <Label for='status-select'>Status</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentStatus(data)
                  dispatch(
                    getUsersTransactions({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      page: currentPage,
                      status: data.value,
                      perPage: rowsPerPage,
                      role: currentType.value,
                      currentPlan: currentPlan.value,
                    })
                  )
                }}
              />
            </Col>
            <Col md='6'>
              <Label for='verification-select'>Type</Label>
              <Select
                isClearable={false}
                value={currentType}
                options={typeOptions}
                className='react-select'
                classNamePrefix='select'
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentType(data)
                  dispatch(
                    getUsersTransactions({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      role: data.value,
                      page: currentPage,
                      perPage: rowsPerPage,
                      status: currentStatus.value,
                      currentPlan: currentPlan.value,
                    })
                  )
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns(handleEditClick)}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <EditSidebar
        open={editSliderState}
        toggleSidebar={toggleEditSidebar}
        selectedRowData={selectedRowData}
      />

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default DepositList
