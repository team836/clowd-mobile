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
} from 'react-native'
import { AppContext } from '@src/context/AppContext'

export type ClowdFile = {
  title: string
  type: string
  size: number
}

export type ClowdFiles = ClowdFile[]

type FileBrowserGridItemProps = {
  title: string
  type: string
  size: number
  onPress: Function
}

const FileBrowserGridItem: React.FC<FileBrowserGridItemProps> = ({
  title,
  type,
  size,
  onPress,
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
            onPress()
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
