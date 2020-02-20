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
        // Fetch file info from server
        appContext.setFileInfo(sampleFileInfo)
      }
    })
  }, [])

  return (
    <>
      <StatusBar hidden={false} />
      <FileBrowserStack.Navigator
        screenOptions={{
          presentation: 'push',
          headerTintColor: '#000',
          headerLargeTitle: true,
        }}
      >
        <FileBrowserStack.Screen name="FileList" component={FileList} />
      </FileBrowserStack.Navigator>
      <SpaceGauge />
      <AddButton />
    </>
  )
}

export default FileBrowserStackScreen
