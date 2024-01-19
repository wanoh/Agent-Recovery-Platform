// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'
import EditTransactionSidebar from './SidebarEditRecoveries'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllRecoveries, getRecoveries } from '../../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
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
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

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
        <Col xl='6' className='p-0 mb-3'>
          <h4>Recoveries</h4>
        </Col>
      </Row>
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
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const recoveriesTable = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.users)
  const toggleEditSidebar = () => setEditSliderState(!editSliderState)
  const { id } = useParams()
  // ** Function to handle edit button click
  const handleEditClick = (row) => {
    setSelectedRowData(row)
    toggleEditSidebar()
  }

  const ToastContent = ({ msg }) => {
    return (
      <div className='d-flex'>
        <span>{msg}</span>
      </div>
    )
  }

  const handleDelete = async (row) => {
    const recoveryRef = doc(db, 'recoveries', id)
    try {
      const doc = await getDoc(recoveryRef)

      if (doc.exists) {
        const recoveriesData = doc.data().recoveriesData

        console.log('--++++--', recoveriesData)

        for (const item of recoveriesData) {
          if (item.id === row.id) {
            await updateDoc(recoveryRef, { recoveriesData: arrayRemove(item) })
          }
        }

        // ** Fetch All Recoveries
        dispatch(getAllRecoveries(id))
        dispatch(getRecoveries({ id }))

        // ** Success Toast
        toast.success((t) => (
          <ToastContent msg={'Recovery successfully Deleted!'} />
        ))
      } else {
        console.log('Document not found!')
        toast.success((t) => <ToastContent msg={'Document not found!'} />)
      }
    } catch (error) {
      // ** Error Toast
      toast.success((t) => <ToastContent msg={'Error Deleting Recovery!'} />)
      console.log('Error while deleting recoveries', error)
    }
  }

  // ** Edit Slider State
  const [editSliderState, setEditSliderState] = useState(false)

  // ** State variable to store selected row data
  const [selectedRowData, setSelectedRowData] = useState(null)

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
    dispatch(getAllRecoveries(id))
    dispatch(
      getRecoveries({
        id,
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
  }, [dispatch, store.recoveriesData.length, sort, sortColumn, currentPage])

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getRecoveries({
        id,
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
      getRecoveries({
        id,
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
      getRecoveries({
        id,
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
    const count = Number(Math.ceil(store.totalRecoveries / rowsPerPage))

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

    console.log('store.recoveriesData', store.recoveriesData)
    console.log('store.allRecoveriesData', store.allRecoveriesData)

    if (store.recoveriesData.length > 0) {
      return store.recoveriesData
    } else if (store.recoveriesData.length === 0 && isFiltered) {
      return []
    } else {
      return store.allRecoveriesData.slice(0, rowsPerPage)
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getRecoveries({
        id,
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
            pagination
            responsive
            paginationServer
            columns={columns({ handleEditClick, handleDelete })}
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

      <EditTransactionSidebar
        open={editSliderState}
        toggleSidebar={toggleEditSidebar}
        selectedRowData={selectedRowData}
      />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default recoveriesTable
