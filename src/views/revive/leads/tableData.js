// ** Table Column
export const tableColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: (row) => row[0],
  },
  {
    name: 'Full Name',
    sortable: true,
    minWidth: '225px',
    selector: (row) => row[0],
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '310px',
    selector: (row) => row[1],
  },
  {
    name: 'Password',
    sortable: true,
    minWidth: '250px',
    selector: (row) => row[2],
  },
  {
    name: 'Broker Passwrod',
    sortable: true,
    minWidth: '100px',
    selector: (row) => row[3],
  },
  {
    name: 'Phone',
    sortable: true,
    minWidth: '175px',
    selector: (row) => row[4],
  },
  {
    name: 'Country',
    sortable: true,
    minWidth: '175px',
    selector: (row) => row[5],
  },
  {
    name: 'Language',
    sortable: true,
    minWidth: '175px',
    selector: (row) => row[6],
  },
  {
    name: 'Broker',
    sortable: true,
    minWidth: '175px',
    selector: (row) => row[7],
  },
  {
    name: 'Status',
    sortable: true,
    minWidth: '175px',
    selector: (row) => row[8],
  },
  {
    name: 'Funnel',
    sortable: true,
    minWidth: '175px',
    selector: (row) => row[9],
  },
]
