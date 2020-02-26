import React, { useContext, useState } from 'react'
import {
  StatusBar,
  View,
  TouchableHighlight,
  ActionSheetIOS,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FileBrowserScreen from '@src/navigation-screen/FileBrowserScreen'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as Device from 'expo-device'
import { ClowdConstants } from '@src/constants'
import { BlurView } from 'expo-blur'
import ClowdStatusBar from './StatusBar'
import { AppContext } from '@src/context/AppContext'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import { Buffer } from 'buffer'
import StartScreen from '@src/screen/StartScreen'

export type RootStackParamList = {
  FileBrowser: { folderName: string; pathName: string } | undefined
  StartScreen: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const MainScaffold: React.FC = () => {
  const appContext = useContext(AppContext)
  const [totalSpace, setTotalSpace] = useState(0)
  const [freeSpace, setFreeSpace] = useState(0)
  ;(async () => {
    setTotalSpace((await FileSystem.getTotalDiskCapacityAsync()) / 1024 ** 3)
    setFreeSpace((await FileSystem.getFreeDiskStorageAsync()) / 1024 ** 3)
  })()

  return (
    <View
      style={{
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <NavigationNativeContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerLargeTitle: true,
            contentStyle: {
              backgroundColor: '#fff',
            },
          }}
        >
          {/* <Stack.Screen name="FileBrowser" component={FileBrowserScreen} /> */}
          <Stack.Screen name="StartScreen" component={StartScreen} />
        </Stack.Navigator>
        <TouchableOpacity
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                title: 'Create a new folder or upload a file',
                options: [
                  'Create a Folder',
                  'Browse Files',
                  'Photo Album',
                  'Cancel',
                ],
                cancelButtonIndex: 3,
              },
              async index => {
                if (index === 0) {
                } else if (index === 1) {
                  const result = await DocumentPicker.getDocumentAsync()
                  console.log(result.name)
                  const file = await FileSystem.readAsStringAsync(result.uri, {
                    encoding: 'base64',
                  })
                } else if (index === 2) {
                  const result = await ImagePicker.launchImageLibraryAsync()
                  if (result.cancelled === false) {
                    const file = await FileSystem.readAsStringAsync(
                      result.uri,
                      {
                        encoding: 'base64',
                      }
                    )
                    const splittedPieces = file.match(/.{1,10485760}/g)
                    const encryptedPieces = splittedPieces.map(
                      piece =>
                        CryptoJS.AES.encrypt(piece, 'clowd836').toString()
                      // piece
                    )
                    const slashSplitted = result.uri.split('/')
                    const filePath =
                      appContext.currentPathName +
                      slashSplitted[slashSplitted.length - 1]
                    encryptedPieces.forEach((encryptedPiece, i) => {
                      axios({
                        url: 'https://clowd.xyz/v1/client/file',
                        method: 'post',
                        data: [
                          {
                            name: filePath,
                            order: encryptedPieces.length === 1 ? -1 : i,
                            data: encryptedPiece,
                          },
                        ],
                      })
                    })
                    const updatedFileInfo = [...appContext.fileInfo]
                    updatedFileInfo.push({
                      path: filePath,
                      size: 999,
                    })
                    appContext.setFileInfo(updatedFileInfo)
                  }
                }
              }
            )
          }}
          style={{
            backgroundColor: '#fff',
            width: 65,
            height: 65,
            position: 'absolute',
            right: 30,
            bottom: 70 + getBottomSpace(),
            borderRadius: 50,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={1}
        >
          <Image
            source={require('@src/assets/images/plus.png')}
            style={{
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
      </NavigationNativeContainer>
      <ClowdStatusBar onSearch={() => {}} />
      <BlurView
        tint="default"
        intensity={100}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          height: ClowdConstants.gaugeHeight + getBottomSpace(),
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <View
          style={{
            backgroundColor: '#e0e0e0',
            opacity: 0.7,
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            height: ClowdConstants.gaugeHeight,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 4,
              borderRadius: 10,
              position: 'relative',
              backgroundColor: '#fff',
              overflow: 'hidden',
              justifyContent: 'flex-start',
            }}
          >
            <View
              style={{
                backgroundColor: '#0E85F3',
                height: '100%',
                width: `${((totalSpace - freeSpace) / totalSpace) * 100}%`,
              }}
            ></View>
          </View>
          <View
            style={{
              marginLeft: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
              }}
            >
              {(totalSpace - freeSpace).toFixed(1)}GB /{' '}
            </Text>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 13,
              }}
            >
              {totalSpace.toFixed(1)}GB
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  )
}

export default MainScaffold
