import React, { useEffect, useState, useContext } from 'react'
import { Text, StatusBar, Button, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FileList from '@src/component/FileList'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParams } from '@root/App'
import * as SecureStore from 'expo-secure-store'
import AddButton from '@src/component/AddButton'
import SpaceGauge from '@src/component/SpaceGauge'
import { AppContext } from '@src/context/AppContext'
import sampleFileInfo from '@src/data/sample-file-info'
import axios from 'axios'

export type FileBrowserStackScreenParamList = {
  FileList: {
    title: string
    folderName: string
    pathName: string
  }
}

export type FileBrowserStackScreenNavigationProp = StackNavigationProp<
  FileBrowserStackScreenParamList
>

export type FileBrowserStackScreenRouteProp = RouteProp<
  FileBrowserStackScreenParamList,
  'FileList'
>

export type FileBrowserStackScreenParams = {
  navigation: FileBrowserStackScreenNavigationProp
}

const FileBrowserStack = createNativeStackNavigator<
  FileBrowserStackScreenParamList
>()

const FileBrowserStackScreen: React.FC<RootStackParams> = ({ navigation }) => {
  const appContext = useContext(AppContext)

  // Check if there exists an access token
  // If not, navigate to Google sign in screen
  useEffect(() => {
    SecureStore.getItemAsync('accessToken').then(accessToken => {
      if (!accessToken) {
        navigation.push('Start')
      } else {
        // Access token exists
        // Check if the token valid
        // if not, refresh tokens
        axios({
          url: 'https://clowd.xyz/check-token',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then(res => {
            console.log(res.data)
          })
          .catch(err => {
            if (err && err.response) {
              const status = err.response.status
              if (status === 404) {
                // Valid
                console.log('valid tokens')
              } else {
                console.log('invalid tokens -> refreshing tokens')
                SecureStore.getItemAsync('refreshToken').then(refreshToken => {
                  axios({
                    url: 'https://api.clowd.xyz/v1/auth/login/refresh',
                    method: 'get',
                    headers: {
                      Authorization: `Bearer ${refreshToken}`,
                    },
                  })
                    .then(res => {
                      console.log('tokens have been refreshed')
                      // Refresh the tokens and store to the machine again
                      const { accessToken, refreshToken } = res.data
                      SecureStore.setItemAsync('accessToken', accessToken)
                      SecureStore.setItemAsync('refreshToken', refreshToken)
                      appContext.setAccessToken(accessToken)
                      appContext.setRefreshToken(refreshToken)
                    })
                    .catch(err => {
                      console.log('should login again')
                      navigation.push('Start')
                    })
                })
              }
            }
          })

        // TODO
        // Fetch file info from server
        axios
          .get('https://clowd.xyz/v1/client/dir', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(res => {
            const fileList = res.data
            // appContext.setFileInfo(sampleFileInfo)
            appContext.setFileInfo(
              fileList.map(file => {
                return {
                  path: file.name,
                  size: parseFloat((file.size / 1024 / 1024).toFixed(2)),
                }
              })
            )
          })

        appContext.setAccessToken(accessToken)

        SecureStore.getItemAsync('refreshToken').then(refreshToken => {
          console.log(refreshToken)
          appContext.setRefreshToken(refreshToken)
        })
      }
      // navigation.push('Start')
    })
  }, [])

  return (
    <>
      <StatusBar hidden={false} />
      <FileBrowserStack.Navigator
        screenOptions={{
          stackPresentation: 'push',
          headerTintColor: '#000',
          headerLargeTitle: true,
        }}
      >
        <FileBrowserStack.Screen name="FileList" component={FileList} />
      </FileBrowserStack.Navigator>
      {/* <SpaceGauge /> */}
      <AddButton />
    </>
  )
}

export default FileBrowserStackScreen
