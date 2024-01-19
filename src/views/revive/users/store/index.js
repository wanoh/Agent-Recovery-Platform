// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Store Imports
import axios from 'axios'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { auth, db } from '../../../../configs/firebase'
import { useSelector } from 'react-redux'

export const getAllData = createAsyncThunk(
  'users/getAllData',
  async (agent) => {
    try {
      const usersCollectionRef = collection(db, 'profiles')
      const usersSnapshot = await getDocs(usersCollectionRef)

      if (!usersSnapshot.empty) {
        const data = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        console.log('Firebase users', data)

        return data.filter(
          (user) =>
            user.role === 'client' && user.assignedAgent?.email === agent?.email
        )
      } else {
        console.log('No documents found in "leads" collection.')
        return {}
      }
    } catch (error) {
      console.error('Error getting documents: ', error.message)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const getData = createAsyncThunk('users/getData', async (params) => {
  try {
    const usersCollectionRef = collection(db, 'profiles')
    const usersSnapshot = await getDocs(usersCollectionRef)

    if (!usersSnapshot.empty) {
      const data = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      const agentUsers = data.filter(
        (user) =>
          user.role === 'client' && user.assignedAgent?.email === params?.email
      )

      return {
        params,
        data: agentUsers,
        totalPages: agentUsers.length,
      }
    } else {
      console.log('No documents found in "leads" collection.')
      return {}
    }
  } catch (error) {
    console.error('Error getting documents: ', error.message)
    throw error // This will be the payload of the rejected action
  }
})

export const getUser = createAsyncThunk('users/getUser', async (id) => {
  const profileRef = doc(db, 'profiles', id)
  const accountDataRef = doc(db, 'userAccounts', id)
  const transactionsRef = doc(db, 'transactions', id)
  const recoveriesRef = doc(db, 'recoveries', id)
  const userLogsRef = doc(db, 'userLogs', id)
  const userSalesReportRef = doc(db, 'userSalesReport', id)

  const profile = await getDoc(profileRef)
  const accountData = await getDoc(accountDataRef)
  const transactions = await getDoc(transactionsRef)
  const recoveries = await getDoc(recoveriesRef)
  const logs = await getDoc(userLogsRef)
  const salesReport = await getDoc(userSalesReportRef)
  console.log('Single User Data', {
    profile: profile.data(),
    accountData: accountData.data(),
    transactions: transactions.data(),
    recoveries: recoveries.data(),
    logs: logs.data(),
    salesReport: salesReport.data(),
  })
  return {
    profile: profile.data(),
    accountData: accountData.data(),
    transactions: transactions.data(),
    recoveries: recoveries.data(),
    logs: logs.data(),
    salesReport: salesReport.data(),
  }
})

export const addRecovery = createAsyncThunk(
  'users/addRecovery',
  async (data, { dispatch }) => {
    const recoveryRef = doc(db, 'recoveries', id)
    await updateDoc(recoveryRef, { recoveriesData: arrayUnion(data) })
    console.log('Doneeeeeeeeeeee', data)
  }
)

export const addUser = createAsyncThunk(
  'users/addUser',
  async (user, { dispatch, getState }) => {
    await axios.post('/apps/users/add-user', user)
    await dispatch(getData(getState().users.params))
    await dispatch(getAllData())
    return user
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { dispatch, getState }) => {
    await axios.delete('/apps/users/delete', { id })
    await dispatch(getData(getState().users.params))
    await dispatch(getAllData())
    return id
  }
)

export const getAllRecoveries = createAsyncThunk(
  'users/getAllRecoveries',
  async (params) => {
    try {
      const recoveriesRef = doc(db, 'recoveries', params)
      const recoveriesData = await getDoc(recoveriesRef)
      const data = recoveriesData.data().recoveriesData
      console.log('Firebase Recoveries', data)
      return data
    } catch (error) {
      console.error('Error getting documents: ', error.message)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const getRecoveries = createAsyncThunk(
  'users/getRecoveries',
  async (params) => {
    try {
      const recoveriesRef = doc(db, 'recoveries', params.id)
      const recoveriesData = await getDoc(recoveriesRef)
      const data = recoveriesData.data().recoveriesData
      console.log('Store Recoveries Data', data)

      return {
        params,
        data,
        totalPages: data.length,
      }
    } catch (error) {
      console.error('Error getting documents: ', error.message)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const getSalesReport = createAsyncThunk(
  'users/getSalesReport',
  async (id) => {
    try {
      const salesReportRef = doc(db, 'userSalesReport', id)
      const salesReportData = await getDoc(salesReportRef)
      const data = salesReportData.data().salesReportData
      console.log('Store Sales Report Data', data)

      return {
        data,
        totalPages: data.length,
      }
    } catch (error) {
      console.error('Error getting Sales Report: ', error.message)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const getAllUsersRecoveries = createAsyncThunk(
  'users/getAllUsersRecoveries',
  async (agentAuth) => {
    try {
      const allUsersRecovriesCollectionRef = collection(db, 'recoveries')
      const allUsersRecoveriesSnapshot = await getDocs(
        allUsersRecovriesCollectionRef
      )

      if (!allUsersRecoveriesSnapshot.empty) {
        const recoveriesArray = allUsersRecoveriesSnapshot.docs.map((doc) => ({
          ...doc.data(),
        }))

        const flattenedRecoveriesArray = await Promise.all(
          recoveriesArray.map(async (recoveries) => {
            const nestedRecoveriesArray = Object.values(recoveries).flatMap(
              (nestedObj) => Object.values(nestedObj)
            )

            return await Promise.all(
              nestedRecoveriesArray.map(async (recoveryObj) => {
                if (recoveryObj.userId) {
                  const profileRef = doc(db, 'profiles', recoveryObj.userId)
                  const profile = await getDoc(profileRef)
                  const userData = profile.data()

                  if (
                    profile.exists() &&
                    userData.assignedAgent.email === agentAuth.email
                  ) {
                    return {
                      ...recoveryObj,
                      ...userData,
                      id: recoveryObj.id,
                      createdAt: recoveryObj.createdAt,
                    }
                  }
                }
                return null // If userId is undefined or profile doesn't exist, return null
              })
            )
          })
        )

        const filteredRecoveriesArray = flattenedRecoveriesArray
          .flat()
          .filter((recovery) => recovery !== null) // Filter out null objects

        const sortedRecoveriesArray = filteredRecoveriesArray.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        )

        console.log('filteredRecoveriesArray ', sortedRecoveriesArray)

        return {
          data: sortedRecoveriesArray,
          totalPages: sortedRecoveriesArray.length,
        }
      } else {
        console.log('No Recoveries found in collection.')
        return {
          data: [],
          totalPages: 0,
        }
      }
    } catch (error) {
      console.error('Error getting Recoveries for all users: ', error)
      throw error
    }
  }
)

export const getAllTransactions = createAsyncThunk(
  'users/getAllTransactions',
  async (params) => {
    try {
      const transactionsRef = doc(db, 'transactions', params)
      const transactionsData = await getDoc(transactionsRef)
      const data = transactionsData.data().transactionsData
      console.log('Firebase Transactions', data)
      return data
    } catch (error) {
      console.error('Error getting transactions documents: ', error.message)
      throw error
    }
  }
)

export const getTransactions = createAsyncThunk(
  'users/getTransactions',
  async (params) => {
    try {
      const transactionsRef = doc(db, 'transactions', params.id)
      const transactionsData = await getDoc(transactionsRef)
      const data = transactionsData.data().transactionsData
      console.log('Store Transactions Data', data)
      return {
        params,
        data,
        totalPages: data.length,
      }
    } catch (error) {
      console.error('Error getting transactions documents: ', error.message)
      throw error
    }
  }
)

export const getAllUsersTransactions = createAsyncThunk(
  'users/getAllUsersTransactions',
  async (agentAuth) => {
    try {
      const usersTransactionsCollectionRef = collection(db, 'transactions')
      const usersTransactionsSnapshot = await getDocs(
        usersTransactionsCollectionRef
      )

      if (!usersTransactionsSnapshot.empty) {
        const data = usersTransactionsSnapshot.docs.map((doc) => ({
          ...doc.data(),
        }))

        const flattenedArray = await Promise.all(
          data.map(async (obj) => {
            const nestedArray = Object.values(obj).flatMap((nestedObj) =>
              Object.values(nestedObj)
            )

            return await Promise.all(
              nestedArray.map(async (innerObj) => {
                // Check if innerObj.userId is defined before creating the reference
                if (innerObj.userId) {
                  const profileRef = doc(db, 'profiles', innerObj.userId)
                  const profile = await getDoc(profileRef)

                  const userData = profile.data()
                  if (
                    profile.exists() &&
                    userData.assignedAgent.email === agentAuth.email
                  ) {
                    return {
                      ...innerObj,
                      ...userData,
                      id: innerObj.id,
                      createdAt: innerObj.createdAt,
                    }
                  }
                }
                return {} // If userId is undefined or profile doesn't exist, return innerObj as is
              })
            )
          })
        )

        const sortedArray = flattenedArray
          .flat()
          .sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds)

        console.log('flattenedArray All', sortedArray)

        return sortedArray
      } else {
        console.log('No Transactions found in collection.')
        return []
      }
    } catch (error) {
      console.error('Error getting Transactions for all users: ', error)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const getUsersTransactions = createAsyncThunk(
  'users/getUsersTransactions',
  async (agentAuth) => {
    try {
      const usersTransactionsCollectionRef = collection(db, 'transactions')
      const usersTransactionsSnapshot = await getDocs(
        usersTransactionsCollectionRef
      )

      if (!usersTransactionsSnapshot.empty) {
        const data = usersTransactionsSnapshot.docs.map((doc) => ({
          ...doc.data(),
        }))

        const flattenedArray = await Promise.all(
          data.map(async (obj) => {
            const nestedArray = Object.values(obj).flatMap((nestedObj) =>
              Object.values(nestedObj)
            )

            return await Promise.all(
              nestedArray.map(async (innerObj) => {
                // Check if innerObj.userId is defined before creating the reference
                if (innerObj.userId) {
                  const profileRef = doc(db, 'profiles', innerObj.userId)
                  const profile = await getDoc(profileRef)
                  const userData = profile.data()

                  if (
                    profile.exists() &&
                    userData.assignedAgent.email === agentAuth.email
                  ) {
                    return {
                      ...innerObj,
                      ...userData,
                      id: innerObj.id,
                      createdAt: innerObj.createdAt,
                    }
                  }
                }
                return {} // If userId is undefined or profile doesn't exist, return innerObj as is
              })
            )
          })
        )

        const sortedArray = flattenedArray
          .flat()
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)

        console.log('flattenedArray ', sortedArray)

        return {
          data: sortedArray,
          totalPages: sortedArray.length,
        }
      } else {
        console.log('No Transactions found in collection.')
        return {
          data: [],
          totalPages: 0,
        }
      }
    } catch (error) {
      console.error('Error getting Transactions for all users: ', error)
      throw error // This will be the payload of the rejected action
    }
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    total: 1,
    totalRecoveries: 1,
    totalTransactions: 1,
    params: {},
    allData: [],
    recoveriesData: [],
    allRecoveriesData: [],
    salesReportData: [],
    totalSalesReport: 1,
    transactionsData: [],
    allTransactionsData: [],
    selectedUser: null,
    allUsersTransactionsData: [],
    usersTransactionsData: [],
    totalUsersTransactions: 1,
    allUsersRecoveries: [],
    totalAllUsersRecoveries: 1,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(getAllRecoveries.fulfilled, (state, action) => {
        state.allRecoveriesData = action.payload
      })
      .addCase(getRecoveries.fulfilled, (state, action) => {
        state.recoveriesData = action.payload.data
        state.params = action.payload.params
        state.totalRecoveries = action.payload.totalPages
      })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.salesReportData = action.payload.data
        state.totalSalesReport = action.payload.totalPages
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.allTransactionsData = action.payload
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactionsData = action.payload.data
        state.params = action.payload.params
        state.totalTransactions = action.payload.totalPages
      })
      .addCase(getAllUsersTransactions.fulfilled, (state, action) => {
        state.allUsersTransactionsData = action.payload
      })
      .addCase(getUsersTransactions.fulfilled, (state, action) => {
        state.usersTransactionsData = action.payload.data
        state.totalUsersTransactions = action.payload.totalPages
      })
      .addCase(getAllUsersRecoveries.fulfilled, (state, action) => {
        state.allUsersRecoveries = action.payload.data
        state.totalAllUsersRecoveries = action.payload.totalPages
      })
  },
})

export default usersSlice.reducer
export const { toggleVerificationSlider } = usersSlice.actions
