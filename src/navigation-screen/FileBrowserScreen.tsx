import React, { useState, useContext, useEffect } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Share, Animated } from 'react-native'
import { RootStackParamList } from '@src/component/MainScaffold'
import FileBrowserGridItem, {
  ClowdFile,
  ClowdFiles,
} from '@src/component/FileBrowserGridItem'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import {
  RouteProp,
  useRoute,
  EventListenerCallback,
} from '@react-navigation/native'
import { sampleFiles } from '@src/data/sample-files'
import { ClowdConstants } from '@src/constants'
import { AppContext } from '@src/context/AppContext'
import { getBottomSpace } from 'react-native-iphone-x-helper'

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

function addDummyItems(items: ClowdFiles) {
  const numColumns = 3
  const dummyItemsNum = numColumns - (items.length % numColumns)
  const temp = [...items]
  for (let i = 0; i < dummyItemsNum; i++) {
    temp.push({
      title: '',
      type: '',
    })
  }
  return temp
}

const FileBrowserScreen: React.FC<FileBrowserScreenParams> = ({
  navigation,
}) => {
  const numColumns = 3
  const appContext = useContext(AppContext)
  const route = useRoute<FileBrowserScreenRouteProp>()
  const pathName = route.params?.pathName || '/'
  const [items, setItems] = useState([])

  // Run once the screen has been loaded
  useEffect(() => {
    appContext.setNavigation(navigation)
    appContext.setIsNavShrunken(false)

    const navAnimation = Animated.timing(appContext.scrollY, {
      toValue: 0,
      duration: 300,
    })
    navAnimation.start()

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
              type = info.path.replace(matched[0], '')
              const splitted = info.path.split('/')
              title = splitted[splitted.length - 1]
            } else if (matched[0].endsWith('/')) {
              // Folder
              const splitted = matched[0].split('/')
              title = splitted[splitted.length - 2]
              type = 'folder'
            }
            return {
              title,
              type,
            }
          })
          .filter((item, pos, self) => {
            return (
              self.findIndex(a => {
                return a.title === item.title && a.type === item.type
              }) === pos
            )
          })
      )
    )

    let f: EventListenerCallback<'focus', undefined>
    navigation.addListener(
      'focus',
      (f = () => {
        appContext.setCurrentFolderName(route.params?.folderName || 'Clowd')
      })
    )

    return () => {
      navigation.removeListener('focus', f)
    }
  }, [])

  return (
    <>
      <Animated.FlatList<ClowdFile>
        scrollIndicatorInsets={{
          bottom: ClowdConstants.gaugeHeight,
          top: ClowdConstants.navHeight,
        }}
        contentContainerStyle={{
          paddingTop: ClowdConstants.navHeight + getStatusBarHeight(),
          paddingBottom: ClowdConstants.gaugeHeight + 120 + getBottomSpace(),
        }}
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
        }}
        numColumns={numColumns}
        data={items}
        extraData={items}
        renderItem={({ item }) => (
          <FileBrowserGridItem
            title={item.title}
            type={item.type}
            onPress={() => {
              if (item.type === 'folder') {
                navigation.push('FileBrowser', {
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
        keyExtractor={item => item.title}
      />
    </>
  )
}

export default FileBrowserScreen
