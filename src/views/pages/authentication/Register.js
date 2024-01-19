// ** React Imports
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
// import useJwt from '@src/auth/jwt/useJwt'

//**Firebase  */
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
// import { initBalance } from '../../../configs/firebase/firebaseInitialData'
import {
  auth,
  db,
  facebookProvider,
  googleProvider,
} from '../../../configs/firebase'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
//** Yup */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Logo
import logo from '@src/assets/images/logo/logo-white.png'

// ** Utilities
// import { generateTaxId } from '@utils'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Import Icons
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple, FaYahoo } from 'react-icons/fa'
import { TfiMicrosoftAlt } from 'react-icons/tfi'

// ** Modal
import SpinnerModal from './SpinnerModal'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Button,
  Form,
  Input,
  FormFeedback,
} from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/background-reg.png'
import illustrationsDark from '@src/assets/images/pages/background-reg.png'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { handleLogin } from '../../../redux/firebase.auth'
import { getHomeRouteForLoggedInUser } from '../../../utility/Utils'
import toast from 'react-hot-toast'
import moment from 'moment'

function splitEmail(email) {
  const atIndex = email.indexOf('@') // Find the index of the @ symbol
  if (atIndex === -1) {
    // If no @ symbol is found, return null
    return null
  }
  const username = email.slice(0, atIndex) // Get the substring before the @ symbol
  const domain = email.slice(atIndex + 1) // Get the substring after the @ symbol
  return { username, domain } // Return an object containing the username and domain
}

const defaultValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  terms: false,
}

const Register = () => {
  // ** States
  const [centeredModal, setCenteredModal] = useState(false)

  // ** Error State
  const [errorMsg, setErrorMsg] = useState(null)

  // ** for testing __can be delected
  const userState = useSelector((state) => state.auth)
  console.log('userState', userState)

  const RegisterSchema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password cannot be more than 20 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required'),
    terms: yup.bool().oneOf([true], 'Please accept terms and conditions'),
  })

  // ** Hooks
  const ability = useContext(AbilityContext)
  const { skin } = useSkin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(RegisterSchema),
  })

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  // ** handle register function, takes in the firebase user obj and the input form data
  const handleRegisterUser = async ({ firebaseUser, data }) => {
    console.log('firebaseUser', firebaseUser, 'Data', data)
    // ** User Info from firebase
    const {
      email: authEmail,
      uid: userId,
      photoURL,
      emailVerified,
    } = firebaseUser
    const { refreshToken } = firebaseUser.stsTokenManager
    const { creationTime, lastSignInTime } = firebaseUser.metadata

    // ** Split email to get username
    const { username } = splitEmail(authEmail)

    // ** Temp role
    const tempRole = [{ action: 'manage', subject: 'all' }]

    // ** Account Role
    const role = 'admin'

    // ** Online Status
    const onlineStatus = 'Offline'

    // ** Assigned Agent
    const assignedAgent = {
      name: 'admin',
      email: 'admin@gmail.com',
    }

    // ** Form Input values
    const {
      firstName = '',
      lastName = '',
      addressOne = '',
      country = '',
      state = '',
      city = '',
      contact = '',
      email,
      password,
    } = data

    const fullName = `${firstName} ${lastName}`

    // ** Date Created
    const createdAtDate = moment(
      creationTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('DD/MM/YYYY')
    const createdAtTime = moment(
      creationTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('HH:mm:ss')

    // ** Last LogIn Details
    const lastLoginDate = moment(
      lastSignInTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('DD/MM/YYYY')
    const lastLoginTime = moment(
      lastSignInTime,
      'ddd, DD MMM YYYY HH:mm:ss [GMT]'
    ).format('HH:mm:ss')

    // ** User Data Structure
    const userData = {
      ability: tempRole,
      email: authEmail,
      id: userId,
      refreshToken,
      role,
      avatar: photoURL,
      username,
      firstName,
      lastName,
      fullName,
      addressOne,
      contact,
      country: country.value,
      emailVerified,
      createdAt: {
        date: createdAtDate,
        time: createdAtTime,
      },
      lastLogin: {
        date: lastLoginDate,
        time: lastLoginTime,
      },
      onlineStatus,
      assignedAgent,
      state,
      city,
    }

    console.log('User Data', userData)

    // ** Save User Data to Firestore
    await setDoc(doc(db, 'profiles', userId), userData)
    await setDoc(doc(db, 'userAccounts', userId), accountData(createdBy))
    await setDoc(doc(db, 'transactions', userId), { transactionsData })
    await setDoc(doc(db, 'recoveries', userId), { recoveriesData })
    await setDoc(doc(db, 'userLogs', userId), { activityData })
    await setDoc(doc(db, 'userSalesReport', userId), { saleReportData })
  }

  const onSubmit = async (data) => {
    setCenteredModal(true)
    try {
      const { email, password } = data
      console.log('Input', email, password)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
      const { email: authEmail, uid: userId, photoURL } = user
      const tempRole = [{ action: 'manage', subject: 'all' }]
      const { accessToken, refreshToken } = user.stsTokenManager
      const { username } = splitEmail(authEmail)

      const loginData = {
        ability: tempRole,
        email: authEmail,
        id: userId,
        accessToken,
        refreshToken,
        role: 'admin',
        avatar: photoURL,
        username,

        account: {
          account: 'Recovery',
          fullName: 'ProvideFullName',
          email: 'provideEmail',
          website: 'www.website.com',
          company: 'companyName',
          subscription: 'Basic',
          subscriptionStatus: 'Active',
          subscriptionDate: '01/01/2020',
          subscriptionExpiry: '01/01/2021',
          emailVerified: false,
          accountVerified: false,
          firstName: 'Please Provide',
          lastName: 'Please Provide',
          address: 'Please Provide',
          city: 'Please Provide',
          country: 'Please Provide',
          phone: 'Please Provide',
          lastLogin: 'please provide',
        },
        businessProfile: {
          siteDetails: {},
          socialMedia: {},
          companyDescription: {},
          utilityData: {}, // Remove from business profile
        },
        payments: {
          currency: {
            symbol: '$',
            name: 'USD',
          },
          cryptoWallets: [
            {
              id: 1,
              symbol: 'BTC',
              name: 'Bitcoin',
              walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
              active: true,
            },
            {
              id: 2,
              symbol: 'ETH',
              name: 'Ethereum',
              walletAddress: '0x8ee7D9235e01e6B42345120b5d270bdb763624C7',
              active: false,
            },
            {
              id: 3,
              symbol: 'LTC',
              name: 'Litecoin',
              walletAddress: 'LXzH5V3FfE2KG7m5JvXRW9cJidyxGK3N7g',
              active: false,
            },
            {
              id: 4,
              symbol: 'BCH',
              name: 'Bitcoin Cash',
              walletAddress: 'qzumakvqj38vaxd2szvhxqcrxxeq9tqf5v0fnv4dhw',
              active: true,
            },
          ],
          bankDetails: {
            bankName: 'Bank of America',
            accountName: 'John Doe',
            accountNumber: '123456789',
            routingNumber: '123456789',
            accountType: 'Checking',
            active: true,
          },
          paypalDetails: {
            paypalEmail: 'paypal@gmail.com',
            paypalName: 'John Doe',
            payPalId: '123456789',
            active: false,
          },
        },
      }

      handleRegisterUser(firebaseUser, loginData)
      dispatch(handleLogin(loginData))

      ability.update(loginData.ability)
      setCenteredModal(false)
      navigate(getHomeRouteForLoggedInUser(loginData.role))
    } catch (error) {
      setErrorMsg(error)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      console.log('TokenCreatedFromByGoogle', token)
      const user = result.user

      const { email: authEmail, uid: userId, photoURL } = user
      const tempRole = [{ action: 'manage', subject: 'all' }]
      const { accessToken, refreshToken } = user.stsTokenManager
      const { username } = splitEmail(authEmail)

      const loginData = {
        ability: tempRole,
        email: authEmail,
        id: userId,
        accessToken,
        refreshToken,
        role: 'admin',
        avatar: photoURL,
        username,
      }

      dispatch(handleLogin(loginData))

      await setDoc(doc(db, 'profiles', userId), loginData)
      await setDoc(doc(db, 'amount', userId), initBalance)
      await setDoc(doc(db, 'transactions', userId), transactionsData)
      await setDoc(doc(db, 'incoming', userId), { incomingData })

      ability.update(loginData.ability)
      navigate(getHomeRouteForLoggedInUser(loginData.role))
      // toast((t) => <ToastContent t={t} name={username} />)
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('Error', errorMessage, errorCode)
      setErrorMsg(errorMessage)
    }
  }

  const handleFacebookAuth = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      console.log('TokenCreatedFromByGoogle', token)
      const user = result.user

      const { email: authEmail, uid: userId, photoURL } = user
      const tempRole = [{ action: 'manage', subject: 'all' }]
      const { accessToken, refreshToken } = user.stsTokenManager
      const { username } = splitEmail(authEmail)

      const loginData = {
        ability: tempRole,
        email: authEmail,
        id: userId,
        accessToken,
        refreshToken,
        role: 'admin',
        avatar: photoURL,
        username,
      }

      dispatch(handleLogin(loginData))

      await setDoc(doc(db, 'users', userId), loginData)
      await setDoc(doc(db, 'amount', userId), initBalance)
      // await setDoc(doc(db, 'transactions', userId), transactionsData)
      await setDoc(doc(db, 'incoming', userId), { incomingData })

      ability.update(loginData.ability)
      navigate(getHomeRouteForLoggedInUser(loginData.role))
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('Error', errorCode, errorMessage)
      setError(errorMessage)
    }
  }

  const handleMicrosoftAuth = () => {}

  const handleAppleAuth = () => {}

  const handleYahooAuth = () => {}

  return (
    <>
      <SpinnerModal centeredModal={centeredModal} />
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0'>
          <Link
            className='brand-logo'
            to='https://reviveasset.com/'
            onClick={(e) => e.preventDefault()}
          >
            <img src={logo} alt='logo' height='50' />
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
                Adventure starts here 🚀
              </CardTitle>
              <CardText className='mb-2'>
                Make your financial management easy and fun!
              </CardText>

              <Form
                action='/'
                className='auth-register-form mt-2'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='mb-1'>
                  <Label className='form-label' for='register-email'>
                    Email
                  </Label>
                  <Controller
                    id='email'
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='email'
                        placeholder='john@email.com'
                        invalid={errors.email && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.email ? (
                    <FormFeedback>{errors.email.message}</FormFeedback>
                  ) : null}
                </div>
                <div className='mb-1'>
                  <Label className='form-label' for='register-password'>
                    Password
                  </Label>
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
                </div>
                <div className='mb-1'>
                  <Label className='form-label' for='register-confirm-password'>
                    Confirm Password
                  </Label>
                  <Controller
                    id='passwordConfirm'
                    name='passwordConfirm'
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className='input-group-merge'
                        invalid={errors.passwordConfirm && true}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className='form-check mb-1'>
                  <Controller
                    name='terms'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='terms'
                        type='checkbox'
                        checked={field.value}
                        invalid={errors.terms && true}
                      />
                    )}
                  />
                  <Label className='form-check-label' for='terms'>
                    I agree to
                    <a
                      className='ms-25'
                      href='/'
                      onClick={(e) => e.preventDefault()}
                    >
                      privacy policy & terms
                    </a>
                  </Label>
                </div>
                <Button type='submit' block color='primary'>
                  Sign up
                </Button>
              </Form>
              <p className='text-center mt-2'>
                <span className='me-25'>Already have an account?</span>
                <Link to='/login'>
                  <span>Sign in instead</span>
                </Link>
              </p>
              <div className='divider my-2'>
                <div className='divider-text'>or</div>
              </div>
              <div className='auth-footer-btn d-flex justify-content-center'>
                <Button color='primary' onClick={handleGoogleAuth}>
                  <FcGoogle />
                </Button>
                <Button color='primary' onClick={handleFacebookAuth}>
                  <FaFacebook />
                </Button>
                <Button color='primary' onClick={handleMicrosoftAuth}>
                  <TfiMicrosoftAlt />
                </Button>
                <Button color='primary' onClick={handleAppleAuth}>
                  <FaApple />
                </Button>
                <Button color='primary' onClick={handleYahooAuth}>
                  <FaYahoo />
                </Button>
              </div>
              {/* <div className='mt-2'>
                <Alert color='danger'>{errorMsg}</Alert>
              </div> */}
            </Col>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Register
