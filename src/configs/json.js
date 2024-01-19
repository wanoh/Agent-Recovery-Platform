// ----- DASHBOARD -----

// ** Deposit Table
const dashboardDeposits = {
  email: 'string',
  amount: 'number',
  date: 'string',
}

// ** Withdrawal Table
const dashboardWithdrawal = {
  email: 'string',
  amount: 'number',
  date: 'string',
}

// ----- USERS -----
// ** Users Object
const userObject = {
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  plan: 'string',
  emailStatus: 'boolean',
  dateCreated: 'string',
  taxID: 'string',
  contact: 'string',
  language: 'string',
  country: 'string',
  lastLogin: 'string',
  assignedAgent: {
    email: 'string',
    name: 'string',
  },
}
// **Users Table
const usersTable = {
  email: 'string',
  name: 'string',
  userID: 'string',
  plan: 'string',
  verification: 'string',
  status: 'string',
}

// --- USER DETAILS PAGE

// ** incoming transactions table
const incomingTransactions = {
  id: 'string',
  company: 'string',
  reason: 'string',
  status: 'string',
  amount: 'number',
  progress: 'number',
  date: 'string',
  market: 'string',
}

// ** verifications table
const verificationTable = {
  name: 'string',
  status: 'boolean',
}

// ** withdrawal table
const withdrawalsTable = {
  id: 'string',
  type: 'string',
  date: 'string',
  amount: 'number',
  status: 'string',
}

// ** deposit table
const depositsTable = {
  id: 'string',
  type: 'string',
  date: 'string',
  amount: 'number',
  status: 'string',
}

// ** Lead Activity
const leadActivity = {
  lastCallStatus: 'string',
  leadStatus: 'string',
  leadClosingStatus: 'string',
}

// -----AGENTS-----
// ** Agent object
const agentsObject = {
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  status: 'string',
  dateCreated: 'string',
  contact: 'string',
  language: 'string',
  country: 'string',
  lastLogin: 'string',
  assignedUsers: 'number',
}

// ** Agents table
const agentTable = {
  email: 'string',
  name: 'string',
  agentID: 'string',
  assignedUsers: 'number',
  status: 'string',
}

// ---- AGENTS VIEW DETAILS -----
// ** Assigned Users Table
const assignedUsersTable = {
  user: 'string',
  userID: 'string',
  plan: 'string',
  verification: 'string',
  status: 'string',
}

// ----- DEPOSITS -----
// ** Deposits Table
const depositTable = {
  name: 'string',
  email: 'string',
  userID: 'string',
  amount: 'number',
  status: 'string',
  date: 'string',
  type: 'string',
}

// ----- WITHDRAWAL -----
// ** Withdrawal Table
const withdrawalTable = {
  name: 'string',
  email: 'string',
  userID: 'string',
  amount: 'number',
  status: 'string',
  date: 'string',
  type: 'string',
}

// ----- PAYMENTS ----
// ** Currency
const currencyTable = {
  currency: 'string',
  currencuRate: 'number',
  status: 'string',
}

// ** Crypto
const cypto = {
  cryptoCurrency: 'string',
  cryptoWallet: 'string',
  status: 'string',
}

// ** Bank
const bank = {
  bankName: 'string',
  accountName: 'string ',
  accountNumber: 'number',
  'Iban/Swift': 'string',
  routingNumber: 'number',
  status: 'string',
}

// ** Paypal
const paypal = {
  paypalMode: 'string',
  paypalID: 'string',
  paymentSecrete: 'string',
  status: 'string',
}

// ** Mail
const mail = {
  username: 'string',
  passowrd: 'string',
  mailhost: 'string',
  supportEmail: 'string',
  mailPort: 'string',
  encryptionType: 'string',
  status: 'string',
}

// ------ BUSINESS PROFILE ------
// ** Business information object
const bunsinessProfile = {
  Name: 'string',
  email: 'string',
  role: 'string',
  website: 'string',
  status: 'string',
  emailStatus: 'string',
  dateCreated: 'string',
  contact: 'string',
  address: 'string',
  country: 'string',
  socials: {
    facebook: 'string',
    twitter: 'string',
    instagram: 'string',
    pinterest: 'string',
  },
}

// ** Site Details
const siteDetails = {
  websiteTitle: 'string',
  email: 'string',
  taxID: 'string',
  contact: 'string',
  address: 'string',
  status: 'string',
  country: 'string',
  copyrightText: 'string',
  logoImage: 'string',
  coverImage: 'string',
}
