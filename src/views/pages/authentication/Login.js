// ** React Imports
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Coffee, X } from 'react-feather'

// ** Modal
import SpinnerModal from './SpinnerModal'

// ** Actions
import { handleLogin } from '@store/firebase.auth'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Split Email Func
import {
  splitEmail,
  loginSchema,
  capitaliseStr,
  logoutFirebase,
} from '../../../utility/HelperFunc'

// ** tempRole
const tempRole = [{ action: 'manage', subject: 'all' }]

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
} from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg'
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../configs/firebase'

// ** Yup
import { yupResolver } from '@hookform/resolvers/yup'

import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAllData, getData } from '../../revive/users/store'

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>
            <strong>{name}</strong>
          </h6>
          <X
            size={12}
            className='cursor-pointer'
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <p>
          You have successfully logged in as an{' '}
          <strong className='text-success'>{role}</strong> to Revive Assets. Now
          you can start to explore. Enjoy!
        </p>
      </div>
    </div>
  )
}

const defaultValues = {
  password: '',
  email: '',
}

const Login = () => {
  // ** States
  const [centeredModal, setCenteredModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(loginSchema),
  })

  // ** Login Function
  const handleLoginFunc = async (user) => {
    try {
      const { email: authEmail, uid: userId, photoURL } = user
      const { accessToken, refreshToken, expirationTime, isExpired } =
        user.stsTokenManager
      const { username } = splitEmail(authEmail)

      // ** users collections ref
      const userCollectionRef = collection(db, 'profiles')

      // ** single user ref
      const userRef = doc(userCollectionRef, userId)

      // ** get single user data
      const userFromFirebaseDocs = await getDoc(userRef)

      // user role
      let userRole

      // ** role conditionals
      if (userFromFirebaseDocs.exists()) {
        const userData = userFromFirebaseDocs.data()
        console.log('Agent User Data', userData)
        userRole = userData.role

        if (userRole !== 'agent') {
          setErrorMsg('Account is not valid')
          logoutFirebase()
          return
        }
      }

      const loginData = {
        ability: tempRole,
        email: authEmail,
        id: userId,
        accessToken,
        refreshToken,
        role: userRole,
        avatar: photoURL,
        username: capitaliseStr(username),
        expirationTime,
        isExpired,
      }

      console.log('LoginData', loginData)

      dispatch(handleLogin(loginData))

      dispatch(getAllData(loginData))
      dispatch(getData(loginData))

      ability.update(loginData.ability)

      navigate(getHomeRouteForLoggedInUser(loginData.role))
      toast((t) => (
        <ToastContent
          t={t}
          role={capitaliseStr(loginData.role)}
          name={capitaliseStr(loginData.username)}
        />
      ))
    } catch (error) {
      setErrorMsg('Error Logging in')
      console.log('LogIn error', error)
    }
  }

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  const onSubmit = async (data) => {
    setCenteredModal(true)
    const { email, password } = data
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredentials.user
      handleLoginFunc(user)
      setCenteredModal(false)
    } catch (error) {
      setCenteredModal(false)
      console.log('Error', error)
      if (error.message.includes('invalid-login-credentials')) {
        setErrorMsg('Invalid User Credentials')
      } else {
        setErrorMsg(error.message)
      }
    }
  }

  // ** useEfects
  useEffect(() => {
    // ** onAuthStateChange
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user)
      } else {
        console.log('User is signed out')
      }
    })

    // ** Timer
    const timer = setTimeout(() => {
      setCenteredModal(false)
      setErrorMsg('')
    }, 3500)

    // ** Cleaner Func.
    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [auth, errorMsg])

  return (
    <>
      <SpinnerModal centeredModal={centeredModal} />
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0'>
          <Link
            className='brand-logo'
            to='/'
            onClick={(e) => e.preventDefault()}
          >
            <svg viewBox='0 0 139 95' version='1.1' height='28'>
              <defs>
                <linearGradient
                  x1='100%'
                  y1='10.5120544%'
                  x2='50%'
                  y2='89.4879456%'
                  id='linearGradient-1'
                >
                  <stop stopColor='#000000' offset='0%'></stop>
                  <stop stopColor='#FFFFFF' offset='100%'></stop>
                </linearGradient>
                <linearGradient
                  x1='64.0437835%'
                  y1='46.3276743%'
                  x2='37.373316%'
                  y2='100%'
                  id='linearGradient-2'
                >
                  <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                  <stop stopColor='#FFFFFF' offset='100%'></stop>
                </linearGradient>
              </defs>
              <g
                id='Page-1'
                stroke='none'
                strokeWidth='1'
                fill='none'
                fillRule='evenodd'
              >
                <g
                  id='Artboard'
                  transform='translate(-400.000000, -178.000000)'
                >
                  <g id='Group' transform='translate(400.000000, 178.000000)'>
                    <path
                      d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                      id='Path'
                      className='text-primary'
                      style={{ fill: 'currentColor' }}
                    ></path>
                    <path
                      d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                      id='Path'
                      fill='url(#linearGradient-1)'
                      opacity='0.2'
                    ></path>
                    <polygon
                      id='Path-2'
                      fill='#000000'
                      opacity='0.049999997'
                      points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                    ></polygon>
                    <polygon
                      id='Path-2'
                      fill='#000000'
                      opacity='0.099999994'
                      points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                    ></polygon>
                    <polygon
                      id='Path-3'
                      fill='url(#linearGradient-2)'
                      opacity='0.099999994'
                      points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                    ></polygon>
                  </g>
                </g>
              </g>
            </svg>
            <h2 className='brand-text text-primary ms-1'>Revive Assets</h2>
          </Link>
          <Col
            className='d-none d-lg-flex align-items-center p-5'
            lg='8'
            sm='12'
          >
            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={source} alt='Login Cover' />
            </div>
          </Col>
          <Col
            className='d-flex align-items-center auth-bg px-2 p-lg-5'
            lg='4'
            sm='12'
          >
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='fw-bold mb-1'>
                Welcome to Revive Assets! 👋
              </CardTitle>
              <CardText className='mb-2'>
                Please sign-in to your account and start the adventure
              </CardText>

              <Form
                className='auth-login-form mt-2'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='mb-1'>
                  <Label className='form-label' for='login-email'>
                    Email
                  </Label>
                  <Controller
                    id='email'
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <Input
                        autoFocus
                        type='email'
                        placeholder='john@example.com'
                        invalid={errors.email && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <FormFeedback>
                      <div>{errors.email.message}</div>
                    </FormFeedback>
                  )}
                </div>
                <div className='mb-1'>
                  <div className='d-flex justify-content-between'>
                    <Label className='form-label' for='login-password'>
                      Password
                    </Label>
                    <Link to='/forgot-password'>
                      <small>Forgot Password?</small>
                    </Link>
                  </div>
                  <Controller
                    id='password'
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className='input-group-merge'
                        invalid={errors.password && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.password && (
                    <span className='text-danger'>
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className='form-check mb-1'>
                  <Input type='checkbox' id='remember-me' />
                  <Label className='form-check-label' for='remember-me'>
                    Remember Me
                  </Label>
                </div>
                <Button type='submit' color='primary' block>
                  Sign in
                </Button>
              </Form>
              <p className='mt-2 text-danger'>{errorMsg}</p>
            </Col>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Login
