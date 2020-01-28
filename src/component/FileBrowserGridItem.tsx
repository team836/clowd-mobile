import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  ActionSheetIOS
} from 'react-native'

export type ClowdFile = {
  title: string
  type: string
}

export type ClowdFiles = ClowdFile[]

type FileBrowserGridItemProps = {
  title: string
  type: string
  onPress: Function
}

const FileBrowserGridItem: React.FC<FileBrowserGridItemProps> = ({
  title,
  type,
  onPress
}) => {
  const folderIconSize = 90
  function FileIcon({ type }) {
    let icon = require('../assets/images/folder.png')
    let iconStyles = StyleSheet.create({
      folderIcon: {
        alignSelf: 'center',
        width: folderIconSize,
        height: folderIconSize
      },
      fileIcon: {
        alignSelf: 'center',
        width: folderIconSize / 1.3,
        height: folderIconSize
      }
    })
    let iconStyle = iconStyles.fileIcon

    if (type === 'txt') {
      icon = require('../assets/images/txt.png')
    } else if (type === 'png') {
      icon = require('../assets/images/png.png')
    } else if (type === 'jpg') {
      icon = require('../assets/images/jpg.png')
    } else if (type === 'gif') {
      icon = require('../assets/images/gif.png')
    } else if (type === 'folder') {
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
            padding: 10
          }}
        />
      )
    } else {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            onPress()
          }}
          onLongPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                title: 'action sheet',
                options: ['Move', 'Delete', 'Cancel'],
                cancelButtonIndex: 2
              },
              buttonIndex => {
                console.log(buttonIndex)
              }
            )
          }}
          style={{
            borderRadius: 8,
            flex: 1,
            padding: 10
          }}
        >
          <View>
            <FileIcon type={type} />
            <Text
              style={{
                fontSize: 13,
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
                borderRadius: 5
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  return <Item />
}

export default FileBrowserGridItem

const style = StyleSheet.create({
  itemIcon: {}
})
