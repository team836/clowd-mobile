import React, { useState, useContext, useEffect } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Share, FlatList, Animated, ScrollView } from 'react-native'
import { RootStackParamList } from '@src/component/MainScaffold'
import FileBrowserGridItem, {
  ClowdFile,
  ClowdFiles
} from '@src/component/FileBrowserGridItem'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import ClowdStatusBar from '@src/component/StatusBar'
import {
  RouteProp,
  useRoute,
  EventListenerCallback
} from '@react-navigation/native'
import { sampleFiles } from '@src/data/sample-files'
import { BlurView } from 'expo-blur'
import { ClowdConstants } from '@src/constants'
import { AppContext } from '@src/context/AppContext'

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
  const numColumns = 3

  function addDummyItems(items: ClowdFiles) {
    const dummyItemsNum = numColumns - (items.length % numColumns)
    const temp = [...items]
    for (let i = 0; i < dummyItemsNum; i++) {
      temp.push({
        title: '',
        type: ''
      })
    }
    return temp
  }

  const [items, setItems] = useState(addDummyItems(sampleFiles))

  function searchFiles(name: string) {
    if (name.length === 0) {
      setItems(addDummyItems(sampleFiles))
      return
    }

    const newItems = sampleFiles.filter(item =>
      item.title.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    )

    setItems(addDummyItems(newItems))
  }

  let offset = 0
  const appContext = useContext(AppContext)

  const route = useRoute<FileBrowserScreenRouteProp>()

  useEffect(() => {
    appContext.setNavigation(navigation)
    appContext.setIsNavShrunken(false)
    console.log('screen loaded', appContext.scrollY)
    const navAnimation = Animated.timing(appContext.scrollY, {
      toValue: 0,
      duration: 300
    })
    navAnimation.start()

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
          top: ClowdConstants.navHeight - getStatusBarHeight()
        }}
        contentContainerStyle={{
          paddingTop: ClowdConstants.navHeight,
          paddingBottom: ClowdConstants.gaugeHeight + 50
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: appContext.scrollY
                }
              }
            }
          ],
          {
            useNativeDriver: false
          }
        )}
        style={{
          padding: 5
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
        keyExtractor={(item, index) => item.title}
      />
    </>
  )
}

export default FileBrowserScreen
