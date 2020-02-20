import React, { useContext } from 'react'
import { TouchableOpacity, ActionSheetIOS, Image, Alert } from 'react-native'
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

const AddButton: React.FC = () => {
  const appContext = useContext(AppContext)

  return (
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
              // Create a folder
              console.log(appContext.currentPathName)
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
                }
              }

              const encryptedPieces = splitAndEcryptFile(file)
              encryptedPieces.forEach((encryptedPiece, i) => {
                axios({
                  url: 'https://dev.clowd.xyz/v1/client/file',
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
                size,
              })
              appContext.setFileInfo(updatedFileInfo)
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
        source={require('@src/assets/images/plus-white.png')}
        style={{
          width: 25,
          height: 25,
        }}
      />
    </TouchableOpacity>
  )
}

export default AddButton
