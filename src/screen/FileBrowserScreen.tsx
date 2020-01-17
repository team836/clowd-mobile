import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Share, View, Text, ScrollView, FlatList } from 'react-native'
import { RootStackParamList } from '@root/App'
import FileBrowserGridItem, {
  ClowdFile,
  ClowdFiles
} from '@src/component/FileBrowserGridItem'

type FileBrowserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FileBrowser'
>

type FileBrowserScreenParams = {
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

  function FilesList() {
    const files = sampleFiles.map((file, index) => {
      return (
        <FileBrowserGridItem
          title={file.title}
          type={file.type}
          onPress={() => {
            if (file.type === 'folder') {
              navigation.push('FileBrowser', {
                folderName: file.title
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
          key={index}
        />
      )
    })

    return files
  }

  return (
    <FlatList<ClowdFile>
      style={{
        padding: 10
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
  )
}

export default FileBrowserScreen
