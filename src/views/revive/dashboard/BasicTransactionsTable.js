// ** Table Columns
import { data, basicTransactionsData } from './data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle } from 'reactstrap'

const DataTablesBasic = ({ title }) => {
  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle tag='h4'>{title}</CardTitle>
      </CardHeader>
      <div className='react-dataTable'>
        <DataTable
          noHeader
          data={data}
          pagination
          columns={basicTransactionsData}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationRowsPerPageOptions={[5, 10]}
        />
      </div>
    </Card>
  )
}

export default DataTablesBasic
