// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'

const ApexRadiarChart = (props) => {
  const { completed, litigated, initiated, processing } = props

  const donutColors = {
    series1: '#FF9F43',
    series2: '#EA5455',
    series3: '#00CFE8',
    series4: '#01B401',
    series5: '#00CFE8',
  }

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: 'bottom',
    },
    labels: ['Completed', 'Processing', 'Litigated', 'Initiated'],

    colors: [
      donutColors.series1,
      donutColors.series5,
      donutColors.series3,
      donutColors.series2,
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat',
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val) {
                return parseInt(val)
              },
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: 'Completed',
              formatter(val) {
                if (Array.isArray(val.config.series)) {
                  const total = val.config.series.reduce(
                    (acc, val) => acc + val,
                    0
                  )
                  return total !== 0
                    ? `${((val.config.series[0] / total) * 100).toFixed(2)}%`
                    : '0%'
                }
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1.5rem',
                  },
                },
              },
            },
          },
        },
      },
    ],
  }

  // ** Chart Series
  const series = [completed, processing, litigated, initiated]

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            Incoming Recoveries
          </CardTitle>
          <CardSubtitle className='text-muted'>
            Spending on various categories *
          </CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='donut' height={350} />
      </CardBody>
    </Card>
  )
}

export default ApexRadiarChart
