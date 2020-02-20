import React, { useEffect, useContext, useState } from 'react'
import {
  FileBrowserStackScreenParams,
  FileBrowserStackScreenRouteProp,
} from '@src/screen/FileBrowserStackScreen'
import { Share, Animated, FlatList } from 'react-native'
import { useRoute, EventListenerCallback } from '@react-navigation/native'
import FileBrowserGridItem, {
  ClowdFile,
  ClowdFiles,
} from './FileBrowserGridItem'
import { AppContext } from '@src/context/AppContext'

function addDummyItems(items: ClowdFiles) {
  const numColumns = 3
  const dummyItemsNum = numColumns - (items.length % numColumns)
  const temp = [...items]
  for (let i = 0; i < dummyItemsNum; i++) {
    temp.push({
      title: '',
      type: '',
      size: 0,
    })
  }
  return temp
}

const FileList: React.FC<FileBrowserStackScreenParams> = ({ navigation }) => {
  const route = useRoute<FileBrowserStackScreenRouteProp>()
  const numColumns = 3
  const appContext = useContext(AppContext)
  const [items, setItems] = useState([])
  const pathName = route.params?.pathName || '/'

  navigation.setOptions({
    title: route.params?.title || 'Clowd',
  })

  useEffect(() => {
    const thisInfo = appContext.fileInfo.filter(info => {
      const regExp = new RegExp(`${pathName}.*?[\.\/]`)
      const matched = info.path.match(regExp)
      return matched !== null
    })

    setItems(
      addDummyItems(
        thisInfo
          .map(info => {
            const regExp = new RegExp(`${pathName}.*?[\.\/]`)
            const matched = info.path.match(regExp)
            let type = 'folder'
            let title = ''
            if (matched[0].endsWith('.')) {
              if (matched[0].endsWith('/.')) {
                // Current directory indicator "."
              } else {
                type = info.path.replace(matched[0], '')
                const splitted = info.path.split('/')
                title = splitted[splitted.length - 1]
              }
            } else if (matched[0].endsWith('/')) {
              // Folder
              const splitted = matched[0].split('/')
              title = splitted[splitted.length - 2]
              type = 'folder'
            }
            return {
              title,
              type,
              size: info.size,
            }
          })
          .filter((item, pos, self) => {
            return (
              self.findIndex(a => {
                return (
                  a.title !== '' &&
                  a.title === item.title &&
                  a.type === item.type
                )
              }) === pos
            )
          })
      )
    )
  }, [appContext.fileInfo])

  useEffect(() => {
    let f: EventListenerCallback<'focus', undefined>
    navigation.addListener(
      'focus',
      (f = () => {
        appContext.setCurrentFolderName(route.params?.folderName || 'Clowd')
        appContext.setCurrentPathName(route.params?.pathName || '/')
      })
    )

    return () => {
      navigation.removeListener('focus', f)
    }
  }, [])

  return (
    <>
      <FlatList<ClowdFile>
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: appContext.scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
          }
        )}
        style={{
          padding: 5,
          paddingTop: 20,
          backgroundColor: '#fff',
        }}
        numColumns={numColumns}
        data={items}
        extraData={items}
        renderItem={({ item }) => (
          <FileBrowserGridItem
            title={item.title}
            type={item.type}
            size={item.size}
            onPress={() => {
              if (item.type === 'folder') {
                navigation.push('FileList', {
                  title: item.title,
                  folderName: item.title,
                  pathName: pathName + item.title + '/',
                })
              } else {
                Share.share(
                  {
                    url: '',
                  },
                  {
                    subject: 'title',
                  }
                )
              }
            }}
          />
        )}
        keyExtractor={item => item.size + item.title}
      />
    </>
  )
}

export default FileList
