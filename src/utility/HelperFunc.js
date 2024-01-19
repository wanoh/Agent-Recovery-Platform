import { signOut } from 'firebase/auth'
import * as yup from 'yup'
import { auth } from '../configs/firebase'

// ** UUID
import { v4 as uuidv4 } from 'uuid'

// ** Split Email Func.
export const splitEmail = (email) => {
  const atIndex = email.indexOf('@') // Find the index of the @ symbol
  if (atIndex === -1) {
    // If no @ symbol is found, return null
    return null
  }
  const username = email.slice(0, atIndex) // Get the substring before the @ symbol
  const domain = email.slice(atIndex + 1) // Get the substring after the @ symbol
  return { username, domain } // Return an object containing the username and domain
}

// ** YUP Validation Schema
export const formSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be between 8 and 20 characters long')
    .max(20, 'Password must be between 8 and 20 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  addressOne: yup.string().required('Address is required'),
  addressTwo: yup.string(),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
})

export const importMappingObjectSchema = yup.object().shape({
  'Full Name': yup.number().integer().required('Full Name field is required'),
  Email: yup.number().integer().required('Email field is required'),
  Phone: yup.number().integer().required('Phone field is required'),
  Country: yup.number().integer().required('Country field is required'),
})

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
})

export const transactionsSchema = yup.object().shape({
  company: yup.string().required('Company is required'),
  reason: yup.string().required('Reason is required'),
  amount: yup.number().required('Amount is required'),
  status: yup.mixed().required('Status is required'),
  market: yup.mixed().required('Select a market'),
  instruments: yup.mixed().required('Select at least one instrument'),
})

// ** Country Options for forms
export const countryOptions = [
  { label: 'Australia', value: 'Australia' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Belarus', value: 'Belarus' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Canada', value: 'Canada' },
  { label: 'China', value: 'China' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Korea', value: 'Korea' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Russia', value: 'Russia' },
  { label: 'South', value: 'South' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
]

// ** Initial data for users
export const recoveriesData = []
export const activityData = []
export const saleReportData = []
export const initBalance = {
  totalBalance: '00.00',
  cryptoBalance: '00.00',
  forexBalance: '00.00',
  cfdBalance: '00.00',
  stocksBalance: '00.00',
}

export const accountData = (createdBy) => ({
  createdBy, // 1.Admin, 2.User, 3.ConvertedLead
  agentAssigned: null,
  POA: {
    name: 'proof of account',
    status: 1, //1 = not-verififed, 2 = submitted, 3 = processing, 4 = verified
    docsNo: 0,
    progress: 0,
    docRefrences: [],
  },
  POC: {
    name: 'proof of communication',
    status: 1, //1 = not-verififed, 2 = submitted, 3 = processing, 4 = verified
    docsNo: 0,
    progress: 0,
    docRefrences: [],
  },
  POL: {
    name: 'proof of location',
    status: 1, //1 = not-verififed, 2 = submitted, 3 = processing, 4 = verified
    docsNo: 0,
    progress: 0,
    docRefrences: [],
  },
  POI: {
    name: 'proof of identity',
    status: 1, //1 = not-verififed, 2 = submitted, 3 = processing, 4 = verified
    docsNo: 0,
    progress: 0,
    docRefrences: [],
  },
})

// ** Initial Transactions Values for users
export const transactionsData = []
export const incomingData = [{ data: null }]

// ** Firebase Logout Func
export const logoutFirebase = async () => {
  try {
    await signOut(auth)
    console.log('Firebase SignOut Successful')
  } catch (error) {
    console.log('Error Logging Out', error)
  }
}

// ** Capitalise
export const capitaliseStr = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ** Random ID
export const generateRandomId = () => {
  const uuid = uuidv4()
  return uuid.slice(0, 8).toUpperCase()
}

export const formatTimestamp = (timestampInSeconds) => {
  // Convert seconds to milliseconds (1 second = 1000 milliseconds)
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Create a new Date object with the timestamp in milliseconds
  const date = new Date(timestampInMilliseconds)

  // Extract date and time components
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // Months are zero-based
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // Format the components as needed
  const formattedDate = `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year}`
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Return the formatted date and time
  return {
    formattedDate,
    formattedTime,
  }
}
