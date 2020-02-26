import React, { useContext, useRef, useState, useEffect } from 'react'
import {
  TouchableOpacity,
  ActionSheetIOS,
  Image,
  Alert,
  View,
  StatusBar,
} from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import CryptoJS from 'crypto-js'
import { AppContext } from '@src/context/AppContext'
import axios from 'axios'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import splitAndEcryptFile from '@src/modules/split-and-encrypt-file'
import addFile from '@src/modules/add-file'
import { Buffer } from 'buffer'
import { Camera } from 'expo-camera'

function makeid(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const AddButton: React.FC = () => {
  const appContext = useContext(AppContext)
  const [camera, setCamera]: [Camera, React.Dispatch<Camera>] = useState()
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect(() => {
    ;(async () => {
      await Camera.requestPermissionsAsync()
    })()
  }, [])

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              title: 'Create a new folder or upload a file',
              options: [
                'Create a Folder',
                'Browse Files',
                'Photo Album',
                'Take a Photo',
                'Cancel',
              ],
              cancelButtonIndex: 4,
            },
            async index => {
              if (index === 0) {
                // Create a folder
                Alert.prompt('Folder name', '', folderName => {
                  const newFileInfo = [...appContext.fileInfo]
                  newFileInfo.push({
                    path: `${appContext.currentPathName}${folderName}/.`,
                    size: 0,
                  })
                  appContext.setFileInfo(newFileInfo)
                })
              } else if (index === 1 || index === 2) {
                let file: string
                let filePath: string
                let size = 0 // In megabytes

                if (index === 1) {
                  const result = await DocumentPicker.getDocumentAsync()
                  file = await FileSystem.readAsStringAsync(result.uri, {
                    encoding: 'base64',
                  })
                  filePath = `${appContext.currentPathName}${result.name}`
                  size = parseFloat(
                    (Buffer.byteLength(file, 'utf8') / 1024 / 1024).toFixed(2)
                  )
                } else if (index === 2) {
                  const result = await ImagePicker.launchImageLibraryAsync()
                  if (result.cancelled === false) {
                    file = await FileSystem.readAsStringAsync(result.uri, {
                      encoding: 'base64',
                    })
                    const slashSplitted = result.uri.split('/')
                    filePath =
                      appContext.currentPathName +
                      slashSplitted[slashSplitted.length - 1]
                    size = parseFloat(
                      (Buffer.byteLength(file, 'utf8') / 1024 / 1024).toFixed(2)
                    )
                  }
                }

                const encryptedPieces = splitAndEcryptFile(file)
                encryptedPieces.forEach((encryptedPiece, i) => {
                  axios({
                    url: 'https://clowd.xyz/v1/client/files',
                    method: 'post',
                    headers: {
                      Authorization: `Bearer ${appContext.accessToken}`,
                    },
                    data: [
                      {
                        name: filePath,
                        order: encryptedPieces.length === 1 ? -1 : i,
                        data: encryptedPiece,
                      },
                    ],
                  })
                    .then(res => {
                      console.log('upload success')
                    })
                    .catch(err => {
                      console.log(err)
                    })
                })
                const updatedFileInfo = [...appContext.fileInfo]
                updatedFileInfo.push({
                  path: filePath,
                  size,
                })
                appContext.setFileInfo(updatedFileInfo)
              } else if (index === 3) {
                setIsCameraActive(true)
              }
            }
          )
        }}
        style={{
          backgroundColor: '#000',
          width: 65,
          height: 65,
          position: 'absolute',
          right: 30,
          bottom: getBottomSpace() + 30,
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
          source={require('@src/assets/images/plus-white.png')}
          style={{
            width: 25,
            height: 25,
          }}
        />
      </TouchableOpacity>
      {isCameraActive && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <StatusBar hidden={true} />
          <Camera
            type="front"
            ref={ref => {
              setCamera(ref)
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: '50%',
              transform: [
                {
                  translateX: -28,
                },
              ],
              bottom: getBottomSpace() + 30,
              width: 56,
              height: 56,
              borderRadius: 50,
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowRadius: 10,
            }}
            onPress={() => {
              ;(async () => {
                const photo = await camera.takePictureAsync()
                const file = await FileSystem.readAsStringAsync(photo.uri, {
                  encoding: 'base64',
                })

                setTimeout(() => {
                  setIsCameraActive(false)

                  const size = parseFloat(
                    (Buffer.byteLength(file, 'utf8') / 1024 / 1024).toFixed(2)
                  )
                  const pathName =
                    appContext.currentPathName + `selfie-${makeid(5)}.jpg`
                  const pieces = splitAndEcryptFile(file)
                  pieces.forEach((piece, i) => {
                    axios({
                      url: 'https://clowd.xyz/v1/client/files',
                      method: 'post',
                      headers: {
                        Authorization: `Bearer ${appContext.accessToken}`,
                      },
                      data: [
                        {
                          name: pathName,
                          order: piece.length === 1 ? -1 : i,
                          data: piece,
                        },
                      ],
                    }).then(res => {
                      console.log('upload success')
                    })
                  })

                  const updatedFileInfo = [...appContext.fileInfo]
                  updatedFileInfo.push({
                    path: pathName,
                    size,
                  })
                  appContext.setFileInfo(updatedFileInfo)
                }, 500)
              })()
            }}
          ></TouchableOpacity>
        </View>
      )}
    </>
  )
}

export default AddButton
