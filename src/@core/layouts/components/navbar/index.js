// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'
import ExpirationTimeModal from './ExpirationTimeModal'

// ** ReactStrap
import { Button } from 'reactstrap'

// ** Auth
import { auth, db } from '../../../../configs/firebase'
import { handleLogout } from '../../../../redux/firebase.auth'

// ** React Hooks
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// ** Helper Func
import { splitEmail, logoutFirebase } from '../../../../utility/HelperFunc'
import { doc, getDoc } from 'firebase/firestore'

// ** User data
const userData = JSON.parse(localStorage.getItem('userData'))

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** States
  const [show, setShow] = useState(true)
  const [expirationTime, setExpirationTime] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [countdown, setCountdown] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleExtendExpirationTime = async () => {
    // ** Get the current user data
    const user = auth.currentUser
    if (user) {
      try {
        const idToken = await user.getIdToken(true)
        if (idToken) {
          const tempRole = [{ action: 'manage', subject: 'all' }]
          const { email: authEmail, uid: userId, photoURL } = user
          const { accessToken, refreshToken, expirationTime, isExpired } =
            user.stsTokenManager
          const { username } = splitEmail(authEmail)

          const userRef = await getDoc(doc(db, 'profiles', userId))

          const userInfo = userRef.data()

          console.log('User', user)
          console.log('userInfo', userInfo)

          const loginData = {
            ability: tempRole,
            email: authEmail,
            id: userId,
            accessToken,
            refreshToken,
            role: userInfo.role,
            avatar: photoURL,
            username,
            expirationTime,
            isExpired,
          }

          localStorage.setItem('userData', JSON.stringify(loginData))
          console.log('Exp Time reset')
        }
      } catch (error) {
        console.error('Error refreshing ID token:', error)
      }
    } else {
      console.log('User is not signed in')
    }
  }

  useEffect(() => {
    setExpirationTime(userData?.expirationTime)
  }, [userData])

  useEffect(() => {
    const updateCountdown = () => {
      const currentTime = new Date().getTime()
      const remainingTime = Math.max(0, expirationTime - currentTime)

      const hours = Math.floor(remainingTime / 3600000)
      const minutes = Math.floor((remainingTime % 3600000) / 60000)
      const seconds = Math.floor((remainingTime % 60000) / 1000)

      const timeCountDown = `${minutes}m ${seconds}s`
      setCountdown(timeCountDown)
      setTimeRemaining(remainingTime)

      // ** Actions when the countdown reaches zero
      if (remainingTime !== isNaN && remainingTime === 0) {
        dispatch(handleLogout())
        logoutFirebase()
        navigate('/login')
      }
    }

    // ** Update every second
    const interval = setInterval(updateCountdown, 1000)

    // ** Clear the interval when the component unmounts
    return () => {
      clearInterval(interval)
    }
  }, [expirationTime])

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
      <div></div>
      {/* 60,000 milliseconds equals 1 min */}
      {timeRemaining !== 0 && timeRemaining <= 900000 ? (
        <ExpirationTimeModal
          countDown={countdown}
          setShow={setShow}
          show={show}
          handleExtendExpirationTime={handleExtendExpirationTime}
        />
      ) : null}
      {timeRemaining !== 0 && show === false && timeRemaining <= 300000 ? (
        <ExpirationTimeModal
          countDown={countdown}
          setShow={setShow}
          show={show}
          handleExtendExpirationTime={handleExtendExpirationTime}
        />
      ) : null}
    </Fragment>
  )
}

export default ThemeNavbar
