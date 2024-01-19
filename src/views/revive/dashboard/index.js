// ** React Imports
import { useState, useContext, useEffect } from 'react'

// ** Images
import userImg from '../../../assets/images/revive/userImg.png'

// ** Icons
import { User, Feather } from 'react-feather'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import { auth, db } from '../../../configs/firebase'
import { doc, getDoc } from 'firebase/firestore'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Demo Components
import WelcomeCard from './CardWelcome'
import StatsCard from './CardStats'
import IncomingRecoveriesChart from './ApexDonutChart'
import DoughnutChart from './ChartjsDoughnutChart'

// ** Third Party Components
import 'chart.js/auto'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import {
  getAllData,
  getAllUsersTransactions,
  getData,
  getAllUsersRecoveries,
} from '../users/store'
import { capitaliseStr } from '../../../utility/HelperFunc'

const Dashboard = () => {
  const dispatch = useDispatch()

  const store = useSelector((state) => state.users)
  const userAuth = useSelector((state) => state.auth.userData)

  useEffect(() => {
    dispatch(getData(userAuth))
    dispatch(getAllData(userAuth))
    dispatch(getAllUsersTransactions(userAuth))
    dispatch(getAllUsersRecoveries(userAuth))
  }, [])

  const data = store.allUsersRecoveries
  const completed = data.filter((rec) => rec.status === 'Completed').length
  const processing = data.filter((rec) => rec.status === 'Processing').length
  const initiated = data.filter((rec) => rec.status === 'Initiated').length
  const litigated = data.filter((rec) => rec.status === 'Litigated').length

  const recoveryTotal = store.allUsersRecoveries.reduce(
    (acc, rec) => acc + rec.amount,
    0
  )

  const depositValue = store.allUsersTransactionsData
    .filter(
      (trans) =>
        trans.type === 'Deposit' &&
        store.data.some((user) => trans.userId === user.id)
    )
    .reduce((sum, trans) => sum + trans.amount, 0)

  const withdrawalValue = store?.allUsersTransactionsData
    .filter(
      (trans) =>
        trans.type === 'Withdrawal' &&
        store.data?.some((user) => trans.userId === user.id)
    )
    .reduce((sum, trans) => sum + trans.amount, 0)

  const pendingWithdrawalValue = store?.allUsersTransactionsData
    .filter(
      (trans) => trans.type === 'Withdrawal' && trans.status === 'Pending'
    )
    .reduce((sum, trans) => sum + trans.amount, 0)

  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    tooltipShadow = 'rgba(0, 0, 0, 0.25)',
    gridLineColor = 'rgba(200, 200, 200, 0.2)',
    lineChartPrimary = '#666ee8',
    lineChartDanger = '#ff4961',
    warningColorShade = '#FF9F43',
    warningLightColor = '#FDAC34',
    successColorShade = '#01B401',
    primaryColorShade = '#836AF9',
    infoColorShade = '#299AFF',
    yellowColor = '#ffe800',
    greyColor = '#4F5D70',
    blueColor = '#2c9aff',
    blueLightColor = '#84D0FF',
    greyLightColor = '#EDF1F4'
  return (
    <div>
      <Row className='match-height'>
        <Col lg='9' sm='12'>
          <WelcomeCard
            fullName={capitaliseStr(userAuth.username)}
            role={userAuth.role}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsCard
            header={'Users'}
            title={'Total'}
            value={store?.data?.length}
            percentage={42}
            increment={10}
            icon={<User size={20} />}
            img={userImg}
          />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='4' xs='12'>
          <DoughnutChart
            title='Balance'
            dataset1={{
              name: 'Total ',
              value: recoveryTotal,
            }}
            dataset2={{
              name: 'Total Available',
              value: recoveryTotal - pendingWithdrawalValue,
            }}
            tooltipShadow={tooltipShadow}
            successColorShade={successColorShade}
            color1={warningLightColor}
            color2={successColorShade}
          />
        </Col>
        <Col lg='4' xs='12'>
          <IncomingRecoveriesChart
            completed={completed}
            processing={processing}
            litigated={litigated}
            initiated={initiated}
          />
        </Col>
        <Col lg='4' xs='12'>
          <DoughnutChart
            title={'Transactions'}
            dataset1={{ name: 'Deposits', value: depositValue }}
            dataset2={{ name: 'Withdrawals', value: withdrawalValue }}
            tooltipShadow={tooltipShadow}
            successColorShade={successColorShade}
            color1={greyLightColor}
            color2={blueLightColor}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
