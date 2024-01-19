// ** React imports
import React, { useEffect, useState } from 'react'

// * CSV parser, Papaparse
import Papa from 'papaparse'

// ** Table Columns
// import { tableColumns } from './tableData'
// console.log('tableColumns', tableColumns)

// ** Third Party Components
import Select from 'react-select'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Mapping Object Validation Schema
import { importMappingObjectSchema } from '../../../utility/HelperFunc'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Label,
  Button,
  Alert,
} from 'reactstrap'

// ** Hooks
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { addTask } from './store'
import { v4 as uuidv4 } from 'uuid'

const ImportModal = ({ showModal, setShowModal }) => {
  // ** States
  const [active, setActive] = useState('1')
  const [error, setError] = useState('')

  const [file, setFile] = useState(null)
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [values, setValues] = useState([])
  const [selectedValues, setSelectedValues] = useState({})
  const [previewColumns, setPreviewColumns] = useState([])

  // ** These States helps to get the numberedID
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPageSize, page) => {
    setPageSize(newPageSize)
    setCurrentPage(page)
  }

  // ** useDispatch
  const dispatch = useDispatch()

  const tasks = useSelector((state) => state.kanban.tasks)

  console.log('All Tasks', tasks)

  console.log('selectedValues', selectedValues)
  // ** Value Options
  const valueOptions = columns.map((column, index) => ({
    value: index,
    label: column,
  }))
  console.log('valueOptions', valueOptions)

  // ** Random id
  const generateRandomId = (index) => {
    const uuid = uuidv4()
    const numberId = (currentPage - 1) * pageSize + tasks.length + index
    const generatedId = uuid.slice(0, 8).toUpperCase()
    return { generatedId, numberId }
  }

  // ** React data table component columns
  const tableColumns = [
    {
      name: 'ID',
      sortable: true,
      maxWidth: '100px',
      selector: (row, index) => generateRandomId(index).numberId,
    },
    {
      name: 'Full Name',
      sortable: true,
      minWidth: '240px',
      required: true,
      selector: (row) =>
        row[selectedValues['Full Name']]
          ? row[selectedValues['Full Name']]
          : '-',
    },
    {
      name: 'Email',
      sortable: true,
      minWidth: '320px',
      required: true,
      selector: (row) =>
        row[selectedValues.Email] ? row[selectedValues.Email] : '-',
    },
    {
      name: 'Password',
      sortable: true,
      minWidth: '120px',
      selector: (row) =>
        row[selectedValues.Password] ? row[selectedValues.Password] : '-',
    },
    {
      name: 'Broker Password',
      sortable: true,
      minWidth: '120px',
      selector: (row) =>
        row[selectedValues['Broker Password']]
          ? row[selectedValues['Broker Password']]
          : '-',
    },
    {
      name: 'Phone',
      sortable: true,
      minWidth: '175px',
      required: true,
      selector: (row) =>
        row[selectedValues.Phone] ? row[selectedValues.Phone] : '-',
    },
    {
      name: 'Country',
      sortable: true,
      required: true,
      minWidth: '175px',
      selector: (row) =>
        row[selectedValues.Country] ? row[selectedValues.Country] : '-',
    },
    {
      name: 'Language',
      sortable: true,
      minWidth: '100px',
      selector: (row) =>
        row[selectedValues.Language] ? row[selectedValues.Language] : '-',
    },
    {
      name: 'Broker',
      sortable: true,
      minWidth: '175px',
      selector: (row) =>
        row[selectedValues.Broker] ? row[selectedValues.Broker] : '-',
    },
    {
      name: 'Status',
      sortable: true,
      minWidth: '100px',
      selector: (row) =>
        row[selectedValues.Status] ? row[selectedValues.Status] : '-',
    },
    {
      name: 'Funnel',
      sortable: true,
      minWidth: '240px',
      selector: (row) =>
        row[selectedValues.Funnel] ? row[selectedValues.Funnel] : '-',
    },
  ]

  const tableColumsOptions = tableColumns.map((value, index) => ({
    value: index,
    label: value.name,
  }))
  console.log('tableColumsOptions', tableColumsOptions)

  // ** useEffect
  useEffect(() => {
    setTimeout(() => setError(''), 2000)
  })

  const toggle = (tab) => {
    setActive(tab)
  }

  // ** Handle file change
  const handleFile = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        const columnArray = []
        const valuesArray = []

        console.log('Results', result)

        result.data.map((d) => {
          columnArray.push(Object.keys(d))
          valuesArray.push(Object.values(d))
        })

        // Extract column headers dynamically
        const dynamicColumns = Object.keys(result.data[0]).map((header) => ({
          name: header,
          selector: header,
          sortable: true,
        }))

        setData(result.data)
        setColumns(columnArray[0])
        setValues(valuesArray)
        setPreviewColumns(dynamicColumns)

        console.log('Results_Data', result.data)
        console.log('columnArray', columnArray)
        console.log('columnArray[0]', columnArray[0])
        console.log('valuesArray', valuesArray)
      },
    })
  }

  // **
  const handleFieldsMapping = (columnName, selectedOption) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [columnName]: selectedOption.value,
    }))
  }

  const handleFileSubmit = () => {
    if (data.length === 0) {
      setError('Upload a file')
      return
    } else if (!file.name.endsWith('.csv')) {
      setError('Only .csv format allowed')
      return
    }

    toggle('2')
  }

  const handleTablePreview = () => {
    // Check if any field is without a selected value
    importMappingObjectSchema
      .validate(selectedValues)
      .then(() => toggle('3'))
      .catch((error) => {
        setError(error.errors[0])
        console.log('Validation Error', error.errors)
      })
  }

  // ** Create Leads from import
  const handleCreateLeads = () => {
    const createLeadArray = values.map((arr, index) => ({
      id: generateRandomId(index).numberId,
      randomId: generateRandomId(index).generatedId,
      fullName: arr[selectedValues['Full Name']],
      email: arr[selectedValues['Email']],
      password: arr[selectedValues['Password']],
      brokerPassword: arr[selectedValues['Broker Password']],
      phone: arr[selectedValues['Phone']],
      country: arr[selectedValues['Country']],
      language: arr[selectedValues['Language']],
      broker: arr[selectedValues['Broker']],
      status:
        arr[selectedValues['Status']] === ''
          ? arr[selectedValues['Status']]
          : 'Not Registered',
      funnel: arr[selectedValues['Funnel']],
    }))
    console.log('createLeadArray', createLeadArray)

    createLeadArray.map((arr) => {
      dispatch(
        addTask({
          boardId: 1,
          title: 'Leads',
          ...arr,
        })
      )
    })

    // ** Close Modal and clear state
    setShowModal(!showModal)
    setValues([])
    setFile(null)
    setData([])
    setColumns([])
    setActive('1')
    setSelectedValues({})
  }

  return (
    <Modal
      isOpen={showModal}
      toggle={() => setShowModal(!showModal)}
      className='modal-dialog-centered modal-lg'
    >
      <ModalHeader toggle={() => setShowModal(!showModal)}>Modal</ModalHeader>
      <ModalBody>
        <React.Fragment>
          <Nav pills>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => active > '1' && toggle('1')}
              >
                File Import
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => active > '2' && toggle('2')}
              >
                Fields
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={active === '3'}>Create Leads</NavLink>
            </NavItem>
          </Nav>
          <TabContent className='py-50' activeTab={active}>
            <TabPane tabId='1'>
              <Label for='csvFile' className='pb-1'>
                <span className='text-danger'>*</span> Data File (CSV Format)
              </Label>{' '}
              <Input
                type='file'
                name='file'
                id='csvFile'
                accept='.csv'
                onChange={handleFile}
                className='pd-2'
              />
              {error ? (
                <p className='text-danger d-flex align-items-end justify-content-end'>
                  {error}
                </p>
              ) : null}
              <div className='d-flex align-items-end justify-content-end'>
                <Button
                  className='w-50 mt-3 '
                  color='primary'
                  outline
                  onClick={handleFileSubmit}
                >
                  Next
                </Button>
              </div>
              {data.length > 1 && (
                <div className='mt-3'>
                  <Card className='overflow-hidden'>
                    <CardHeader>
                      <CardTitle tag='h4'>
                        Preview of the first 10 rows of your imported file
                      </CardTitle>
                    </CardHeader>
                    <div className='react-dataTable'>
                      <DataTable
                        noHeader
                        data={data.slice(0, 10)} // Sliced for first 10 rows only
                        columns={previewColumns}
                        className='react-dataTable'
                        theme={selectThemeColors}
                        sortIcon={<ChevronDown size={10} />}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </TabPane>
            <TabPane tabId='2'>
              <Alert color='warning' className='p-1 mb-3'>
                The following fields are required for the imports procedure to
                work
              </Alert>

              {tableColumns.map((value, i) => (
                <div
                  key={i}
                  className='d-flex align-items-center justify-content-end mb-2 w-100'
                >
                  <Label>
                    <p className='h6 mt-auto mb-auto me-3'>
                      {value.name}{' '}
                      {value.required && (
                        <span className='text-danger me-1'>*</span>
                      )}
                      :
                    </p>
                  </Label>
                  <Select
                    id='fieldID'
                    isClearable={false}
                    className='react-select w-50'
                    classNamePrefix='select'
                    options={valueOptions}
                    onChange={(selectedOption) =>
                      handleFieldsMapping(value.name, selectedOption)
                    }
                    value={valueOptions.find(
                      (option) => option.value === selectedValues[value.name]
                    )}
                  />
                </div>
              ))}

              {/* {valueOptions.map((value, i) => (
                <div
                  key={i}
                  className='d-flex align-items-center justify-content-end mb-2 w-100'
                >
                  <Label>
                    <p className='h6 mt-auto mb-auto me-3'>
                      {value.label}{' '}
                      {value.required && (
                        <span className='text-danger me-1'>*</span>
                      )}
                      :
                    </p>
                  </Label>
                  <Select
                    id='fieldID'
                    isClearable={false}
                    className='react-select w-50'
                    classNamePrefix='select'
                    options={tableColumsOptions}
                    onChange={(selectedOption) =>
                      handleFieldsMapping(value.name, selectedOption)
                    }
                    value={tableColumsOptions.find(
                      (option) => option.value === selectedValues[value.name]
                    )}
                  />
                </div>
              ))} */}

              {error ? (
                <p className='text-danger d-flex align-items-end justify-content-end'>
                  {error}
                </p>
              ) : null}

              <div className='d-flex align-items-end justify-content-end'>
                <Button
                  className='w-50 mt-3 '
                  color='primary'
                  onClick={handleTablePreview}
                >
                  Next
                </Button>
              </div>
            </TabPane>
            <TabPane tabId='3'>
              <Card className='overflow-hidden'>
                <CardHeader>
                  <CardTitle tag='h4'>Imported File</CardTitle>
                </CardHeader>
                <div className='react-dataTable'>
                  <DataTable
                    noHeader
                    pagination
                    data={values}
                    columns={tableColumns}
                    className='react-dataTable'
                    theme={selectThemeColors}
                    sortIcon={<ChevronDown size={10} />}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    paginationPerPage={pageSize}
                    paginationTotalRows={values.length}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                  />
                </div>
              </Card>

              {error ? (
                <p className='text-danger d-flex align-items-end justify-content-end'>
                  {error}
                </p>
              ) : null}
              <div className='d-flex align-items-end justify-content-end'>
                <Button
                  className='w-50 mt-3 '
                  color='primary'
                  onClick={handleCreateLeads}
                >
                  Create Leads
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </React.Fragment>
      </ModalBody>
    </Modal>
  )
}

export default ImportModal
