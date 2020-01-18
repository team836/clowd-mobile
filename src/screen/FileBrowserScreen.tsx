import React, { useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Share, FlatList, Animated } from 'react-native'
import { RootStackParamList } from '@root/App'
import FileBrowserGridItem, {
  ClowdFile,
  ClowdFiles
} from '@src/component/FileBrowserGridItem'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import StatusBar from '@src/component/StatusBar'
import { RouteProp } from '@react-navigation/native'

export type FileBrowserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FileBrowser'
>

export type FileBrowserScreenRouteProp = RouteProp<
  RootStackParamList,
  'FileBrowser'
>

export type FileBrowserScreenParams = {
  navigation: FileBrowserScreenNavigationProp
}

const FileBrowserScreen: React.FC<FileBrowserScreenParams> = ({
  navigation
}) => {
  const sampleFiles: ClowdFiles = [
    {
      title: 'Folder 1',
      type: 'folder'
    },
    {
      title: 'Folder 2',
      type: 'folder'
    },
    {
      title: 'text.txt',
      type: 'txt'
    },
    {
      title: 'image.png',
      type: 'png'
    },
    {
      title: 'photo.jpg',
      type: 'jpg'
    },
    {
      title: 'Folder 3',
      type: 'folder'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    },
    {
      title: 'wallpaper.png',
      type: 'png'
    },
    {
      title: 'memo.txt',
      type: 'txt'
    }
  ]

  const numColumns = 3
  const dummyItemsNum = numColumns - (sampleFiles.length % numColumns)

  for (let i = 0; i < dummyItemsNum; i++) {
    sampleFiles.push({
      title: '',
      type: ''
    })
  }

  return (
    <>
      <StatusBar />
      <FlatList<ClowdFile>
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: 50
        }}
        onScroll={e => {
          // console.log(e.nativeEvent.contentOffset.y)
        }}
        style={{
          padding: 5
        }}
        numColumns={numColumns}
        data={sampleFiles}
        renderItem={({ item }) => (
          <FileBrowserGridItem
            title={item.title}
            type={item.type}
            onPress={() => {
              if (item.type === 'folder') {
                navigation.push('FileBrowser', {
                  folderName: item.title
                })
              } else {
                Share.share(
                  {
                    url: ''
                  },
                  {
                    subject: 'title'
                  }
                )
              }
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  )
}

export default FileBrowserScreen
