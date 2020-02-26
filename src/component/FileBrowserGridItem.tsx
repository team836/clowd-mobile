import React, { useContext } from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActionSheetIOS,
  Alert,
  Share,
} from 'react-native'
import { AppContext } from '@src/context/AppContext'
import { FileBrowserStackScreenNavigationProp } from '@src/screen/FileBrowserStackScreen'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import * as FileSystem from 'expo-file-system'

export type ClowdFile = {
  title: string
  type: string
  size: number
  path: string
}

export type ClowdFiles = ClowdFile[]

type FileBrowserGridItemProps = {
  title: string
  type: string
  size: number
  fullPath: string
  navigation: FileBrowserStackScreenNavigationProp
}

const FileBrowserGridItem: React.FC<FileBrowserGridItemProps> = ({
  title,
  type,
  size,
  navigation,
  fullPath,
}) => {
  const appContext = useContext(AppContext)
  const folderIconSize = 90
  function FileIcon({ type }) {
    let icon = require('../assets/images/folder.png')
    let iconStyles = StyleSheet.create({
      folderIcon: {
        alignSelf: 'center',
        width: folderIconSize,
        height: folderIconSize,
      },
      fileIcon: {
        alignSelf: 'center',
        width: folderIconSize / 1.3,
        height: folderIconSize,
      },
    })
    let iconStyle = iconStyles.fileIcon

    const universalType = type.toLowerCase()

    if (universalType === 'txt') {
      icon = require('../assets/images/txt.png')
    } else if (universalType === 'png') {
      icon = require('../assets/images/png.png')
    } else if (universalType === 'jpg' || universalType === 'jpeg') {
      icon = require('../assets/images/jpg.png')
    } else if (universalType === 'gif') {
      icon = require('../assets/images/gif.png')
    } else if (universalType === 'folder') {
      iconStyle = iconStyles.folderIcon
      icon = require('../assets/images/folder.png')
    }

    return (
      <Image
        source={icon}
        resizeMethod="scale"
        resizeMode="contain"
        style={iconStyle}
      />
    )
  }

  function Item() {
    if (!title) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            padding: 10,
          }}
        />
      )
    } else {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (type === 'folder') {
              navigation.push('FileList', {
                title: title,
                folderName: title,
                pathName: appContext.currentPathName + title + '/',
              })
            } else {
              axios({
                url: `https://clowd.xyz/v1/client/files`,
                method: 'get',
                headers: {
                  Authorization: `Bearer ${appContext.accessToken}`,
                  files: JSON.stringify([
                    {
                      name: appContext.currentPathName + title,
                    },
                  ]),
                },
              })
                .then(res => {
                  // Share.share({
                  //   url: res.data,
                  //   title,
                  // })
                  const fileUri = `data:image/jpg;base64,${res.data[0].data}`
                  FileSystem.downloadAsync(
                    fileUri,
                    FileSystem.documentDirectory +
                      appContext.currentPathName.replace(/^\//g, '') +
                      title
                  ).then(value => {
                    console.log(value)
                    Share.share({
                      url: value.uri,
                      title: title,
                    })
                  })
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }}
          onLongPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                tintColor: '#000',
                title: 'Manipulate a file',
                options: ['Move', 'Delete', 'Cancel'],
                cancelButtonIndex: 2,
              },
              buttonIndex => {
                const pathName = appContext.currentPathName
                const regExp = new RegExp(`${pathName}.*?[\.\/]`)
                const folders = appContext.fileInfo
                  .filter(file => {
                    const matched = file.path.match(regExp)
                    return matched && matched[0].endsWith('/')
                  })
                  .map(file => {
                    const matched = file.path.match(regExp)
                    const splitted = matched[0].split('/')
                    title = splitted[splitted.length - 2]
                    return title
                  })
                  .filter((item, pos, self) => {
                    return (
                      self.findIndex(a => {
                        return a === item
                      }) === pos
                    )
                  })

                if (buttonIndex === 0) {
                  // Move
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      tintColor: '#000',
                      title: 'Choose a folder to move',
                      cancelButtonIndex: folders.length,
                      options: [...folders, 'Cancel'],
                    },
                    buttonIndex => {
                      const selectedFolder = folders[buttonIndex]
                    }
                  )
                } else if (buttonIndex === 1) {
                  // Delete
                  console.log(fullPath)
                  axios
                    .delete('https://clowd.xyz/v1/client/files', {
                      headers: {
                        Authorization: `Bearer ${appContext.accessToken}`,
                      },
                      data: [
                        {
                          name: fullPath,
                        },
                      ],
                    })
                    .then(res => {
                      console.log('delete completed')
                    })
                  const index = appContext.fileInfo.findIndex(item => {
                    return item.path === fullPath
                  })
                  const newFileInfo = [...appContext.fileInfo]
                  if (index >= 0) {
                    newFileInfo.splice(index, 1)
                    appContext.setFileInfo(newFileInfo)
                  }
                }
              }
            )
          }}
          style={{
            borderRadius: 8,
            flex: 1,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <View>
            <FileIcon type={type} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                marginTop: 3,
                alignSelf: 'center',
                color: '#222',
                // backgroundColor: '#f0f1f3',
                padding: 3,
                paddingLeft: 5,
                paddingRight: 5,
                textAlign: 'center',
                overflow: 'hidden',
                borderRadius: 5,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#1277ED',
              }}
            >
              {size} MB
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  return <Item />
}

export default FileBrowserGridItem

const style = StyleSheet.create({
  itemIcon: {},
})
