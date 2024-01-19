import React, { useEffect } from 'react'

// ** custom components
import SalesRepoertSettings from './SalesReportSettings'
import SalesReportInfoCard from './SalesReportInfoCard'
import { useDispatch, useSelector } from 'react-redux'
import { getSalesReport } from '../../store'
import { formatTimestamp } from '../../../../../utility/HelperFunc'
import { useParams } from 'react-router-dom'

const SalesReportSettingsPage = () => {
  // ** Params
  const { id } = useParams()

  // ** Store
  const salesReport = useSelector((state) => state.users.salesReportData)

  // ** Dispatch
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSalesReport(id))
  }, [])

  return (
    <div>
      <div className=''>
        <SalesRepoertSettings />
        <div style={{ height: '600px', overflowY: 'scroll' }}>
          {[...salesReport]
            .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
            .map((saleReport) => (
              <SalesReportInfoCard
                callStatus={saleReport.callStatus}
                salesStatus={saleReport.salesStatus}
                salesClosingStatus={saleReport.salesClosingStatus}
                notes={saleReport.notes}
                createdBy={saleReport.createdBy}
                date={
                  formatTimestamp(saleReport.createdAt.seconds).formattedDate
                }
                time={
                  formatTimestamp(saleReport.createdAt.seconds).formattedTime
                }
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default SalesReportSettingsPage
