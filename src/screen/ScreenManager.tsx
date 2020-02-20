import React, { useContext, isValidElement, useState, useEffect } from 'react'
import StartScreen from '@src/screen/StartScreen'
import MainScaffold from '@src/component/MainScaffold'
import { AppContext } from '@src/context/AppContext'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { View, Dimensions } from 'react-native'

async function checkTokensExist() {
  const accessToken = await SecureStore.getItemAsync('accessToken')
  const refreshToken = await SecureStore.getItemAsync('refreshToken')

  if (accessToken && refreshToken) {
    return true
  } else {
    return false
  }

  // try {
  //   const response = await axios({
  //     url: 'https://dev.api.clowd.xyz/v1/auth/login/refresh',
  //     method: 'get',
  //     headers: {
  //       Authorization: `Bearer ${refreshToken}`,
  //     },
  //   })
  //   console.log(response.data)
  // } catch (error) {
  //   console.error(error)
  // }
}

const ScreenManager: React.FC = () => {
  // TODO: Check authentication and decide which screen to display

  const appContext = useContext(AppContext)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    checkTokensExist().then(res => {
      if (res) {
        appContext.setIsSignedIn(true)
      } else {
        appContext.setIsSignedIn(false)
      }

      setTimeout(() => {
        setIsReady(true)
        console.log('set is ready')
      }, 500)
    })
  }, [])

  return (
    <>
      <MainScaffold />
    </>
  )
}

export default ScreenManager
