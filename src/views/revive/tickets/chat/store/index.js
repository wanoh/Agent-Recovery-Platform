// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Firebase Imports
import {
  arrayUnion,
  doc,
  updateDoc,
  onSnapshot,
  collection,
  setDoc,
} from 'firebase/firestore'
import { db } from '../../../../../configs/firebase'
import { generateRandomId } from '../../../../../utility/HelperFunc'

// ** Reorder Chats
const reorderChats = async (arr, from, to, chatsRef) => {
  // Create a new array with the current chat without modifying the original array
  const chatArray = arr.slice(from, from + 1)
  const chatIndex = arr.indexOf(chatArray[to])

  const updatedArr = [
    arr[chatIndex],
    ...arr.slice(to, chatIndex),
    ...arr.slice(chatIndex + 1),
  ]

  console.log('~~~Array', arr, updatedArr)
  // ** Move the chat to its new position(top)
  // try {
  //   await updateDoc(chatsRef, {
  //     chats: updatedArr,
  //   })
  // } catch (error) {
  //   console.error('Error updating document:', error)
  //   throw error
  // }
}

// ** Get Chats
export const getChatContacts = createAsyncThunk(
  'appChat/getChatContacts',
  async (currentUserId, { getState, dispatch }) => {
    try {
      const chatsRef = collection(db, 'AdminAgentsChat')
      const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
        const chatDataArray = []
        snapshot.forEach((doc) => {
          if (doc.exists()) {
            console.log('#@~ RealTime Chats Snapshot', doc.data())
            chatDataArray.push(doc.data())
          }
        })
        console.log('~~~All chat data:', chatDataArray)

        const admin = getState().users.admin
        console.log('User Redux', getState().users)
        console.log('Admin Contacts ', admin)

        const chatsContacts = chatDataArray.map((chat) => {
          const adminInfo = admin.find((c) => c.id === chat.userId)
          console.log('~~adminInfo', adminInfo, chat)
          const contactInfo = {
            ...adminInfo,
            chat: {
              id: chat.id,
              unseenMsgs: chat.unseenMsgs,
              lastMessage: chat.chat[chat.chat.length - 1],
            },
          }
          return contactInfo
        })

        const adminContacts = admin?.filter((co) => {
          return !chatDataArray.some((ch) => {
            return co.userId === ch.userId
          })
        })

        dispatch({
          type: 'appChat/getChatContactsSuccess',
          payload: {
            chatsContacts,
            contacts: adminContacts,
            allChats: chatDataArray,
            unsubscribe, // Include unsubscribe function in the payload
          },
        })
      })

      // const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      //   const admin = getState().users.admin

      //   if (!snapshot.empty) {
      //     const data = snapshot.data()
      //     const chatsData = data.chats

      //     const chatsContacts = chatsData.map((chat) => {
      //       const adminInfo = admin.find((c) => c.id === chat.userId)
      //       const contactInfo = {
      //         ...adminInfo,
      //         chat: {
      //           id: chat.id,
      //           unseenMsgs: chat.unseenMsgs,
      //           lastMessage: chat.chat[chat.chat.length - 1],
      //         },
      //       }
      //       return contactInfo
      //     })

      //     const adminContacts = admin?.filter((co) => {
      //       return !chatsData.some((ch) => {
      //         return co.id === ch.userId
      //       })
      //     })

      //     dispatch({
      //       type: 'appChat/getChatContactsSuccess',
      //       payload: {
      //         chatsContacts,
      //         contacts: adminContacts,
      //         allChats: chatsData,
      //         unsubscribe, // Include unsubscribe function in the payload
      //       },
      //     })
      //   }
      // })

      return Promise.resolve() // The payload will be dispatched via the `dispatch` call above
    } catch (error) {
      console.log('Error Fetching chats and contacts', error)
      throw error
    }
  }
)

// ** Select Chat
export const selectChat = createAsyncThunk(
  'appChat/selectChat',
  async (obj, { dispatch, getState }) => {
    const { id, curUserId } = obj

    // ** chat user id
    const userId = id

    try {
      const chatsRef = collection(db, 'AdminAgentsChat')
      const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
        const chatDataArray = []
        snapshot.forEach((doc) => {
          if (doc.exists()) {
            console.log('#@~ Added RealTime Chats Snapshot', doc.data())
            chatDataArray.push(doc.data())
          }
        })

        const admin = getState().users.admin

        const chatObj = chatDataArray.find((c) => c.userId === curUserId)

        console.log('Chats * admin', chatObj, chatDataArray, admin)

        const updatedChats = {
          ...chatObj,
          unseenMsgs: 0,
        }

        console.log('Unseen Msg', updatedChats)

        const filterOutSelectedChat = chatDataArray.filter(
          (chatObj) => chatObj.userId !== userId
        )

        const dbChatUpdate = [...filterOutSelectedChat, updatedChats]

        console.log('dbChatUpdate', dbChatUpdate)

        // updateDoc(chatsRef, { chats: dbChatUpdate })

        const contact = admin.find((c) => c.id === userId)

        //   @ts-ignore
        //   if (contact.chat) contact.chat.unseenMsgs = 0

        // await dispatch(getChatContacts(curUserId))

        // console.log('Selected Chat in Redux', { updatedChats, contact })

        dispatch({
          type: 'appChat/selectChatSuccess',
          payload: {
            chat: updatedChats,
            contact,
            unsubscribe, // Include unsubscribe function in the payload
          },
        })
      })

      return Promise.resolve() // The payload will be dispatched via the `dispatch` call above
    } catch (error) {
      console.log('Error Selecting Chat', error)
      throw error
    }
  }
)

// ** Send Msg
export const sendMsg = createAsyncThunk(
  'appChat/sendMsg',
  async (obj, { dispatch, getState }) => {
    const { curUserId } = obj

    const chatId = generateRandomId()
    const chatsRef = doc(db, 'AdminAgentsChat', chatId)

    try {
      const admin = getState().users.admin
      const chatData = getState().chat.allChats
      let activeChat = chatData.find((chat) => chat.userId === curUserId)

      console.log('#OBJ in SendMsg', obj)
      console.log('#chatData in SendMsg', chatData)
      console.log('Active Chat in SendMsg', activeChat)
      console.log('Admin Chat in SendMsg', admin)

      const newMessageData = {
        senderId: curUserId,
        time: new Date(),
        message: obj.message,
        feedback: {
          isSent: true,
          isSeen: false,
          isDelivered: false,
        },
      }

      if (activeChat === undefined) {
        const chat = {
          id: chatId,
          userId: obj.contact.id,
          unseenMsgs: 0,
          chat: [newMessageData],
        }

        await setDoc(chatsRef, chat)

        activeChat = chatData[chatData.length - 1]

        dispatch(getChatContacts())

        const contact = admin.find((co) => co.id === obj.contact.id)

        return { chat, contact }
      } else {
        const updatedActiveChat = {
          ...activeChat,
          chat: [...activeChat.chat, newMessageData],
        }
        console.log('--------------updatedActiveChat', updatedActiveChat)

        // ** Filter out activeChat from all Chats
        const filteredChats = chatData.filter((c) => c.id !== activeChat.userId)
        console.log('filteredChats', filteredChats)

        const updatedChat = [...filteredChats, updatedActiveChat]
        console.log('~~updatedChat', updatedChat)

        const chatDocRef = doc(db, 'AdminAgentsChat', activeChat.id)

        dispatch(getChatContacts())

        await updateDoc(chatDocRef, {
          chat: arrayUnion(newMessageData),
        })

        const contact = admin.find((co) => co.id === obj.contact.id)
        console.log('CONTact', contact)
        console.log(
          'Chat Index',
          chatData.findIndex((c) => c.id === activeChat.id)
        )

        return { chat: updatedActiveChat, contact }
      }
    } catch (error) {
      console.log('Error In sendMsg', error)
      throw error
    }
  }
)

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: [],
    allChats: [],
    contacts: [],
    selectedUser: {},
    unsubscribeChats: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase('appChat/getChatContactsSuccess', (state, action) => {
        state.chats = action.payload.chatsContacts
        state.allChats = action.payload.allChats
        state.contacts = action.payload.contacts

        // If there's an existing unsubscribeChats function, call it to unsubscribe
        if (state.unsubscribeChats) {
          state.unsubscribeChats()
        }

        // Set the new unsubscribeChats function to the returned value from the action payload
        state.unsubscribeChats = action.payload.unsubscribeChats
      })
      .addCase('appChat/selectChatSuccess', (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(sendMsg.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
  },
})

export default appChatSlice.reducer
