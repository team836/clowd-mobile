import React, { useState, useEffect, useContext } from 'react'
import { BlurView } from 'expo-blur'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  TextInput,
  Animated,
} from 'react-native'
import {
  FileBrowserScreenParams,
  FileBrowserScreenRouteProp,
  FileBrowserScreenNavigationProp,
} from '@src/screen/FileBrowserScreen'
import { RootStackParamList } from '@src/component/MainScaffold'
import { ClowdConstants } from '@src/constants'
import { AppContext } from '@src/context/AppContext'

type StatusBarProps = {
  onSearch: (title: string) => void
}

const ClowdStatusBar: React.FC<StatusBarProps> = ({ onSearch }) => {
  // const folderName = route.params?.folderName
  //   ? route.params?.folderName
  //   : 'Clowd'

  const [clowdNavHeight] = useState(
    new Animated.Value(ClowdConstants.navHeight)
  )
  const [searchBarHeight] = useState(new Animated.Value(40))

  const appContext = useContext(AppContext)

  const navShrinkAnimation = Animated.timing(clowdNavHeight, {
    toValue: getStatusBarHeight() + 50,
    duration: 200,
  })
  const navExpandAnimation = Animated.timing(clowdNavHeight, {
    toValue: ClowdConstants.navHeight,
    duration: 200,
  })
  const searchBarShrinkAnimation = Animated.timing(searchBarHeight, {
    toValue: 0,
    duration: 200,
  })
  const searchBarExpandAnimation = Animated.timing(searchBarHeight, {
    toValue: 40,
    duration: 200,
  })

  useEffect(() => {
    if (appContext.isNavShrunken) {
      navExpandAnimation.stop()
      navShrinkAnimation.start()

      searchBarExpandAnimation.stop()
      searchBarShrinkAnimation.start()
    } else {
      navShrinkAnimation.stop()
      navExpandAnimation.start()

      searchBarShrinkAnimation.stop()
      searchBarExpandAnimation.start()
    }
  })

  const [canGoBack, setCanGoBack] = useState(false)
  useEffect(() => {
    if (appContext.currentFolderName === 'Clowd') {
      setCanGoBack(false)
    } else {
      setCanGoBack(true)
    }
  })

  return (
    <Animated.View
      style={{
        zIndex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: ClowdConstants.navHeight,
      }}
    >
      <Animated.View
      // style={{
      //   transform: [
      //     {
      //       translateY: appContext.scrollY.interpolate({
      //         inputRange: [-20, 0, 60, 61],
      //         outputRange: [15, 0, -60, -60]
      //       })
      //     }
      //   ]
      // }}
      >
        <BlurView
          tint="default"
          intensity={100}
          style={{
            opacity: 1,
            zIndex: 1,
            position: 'absolute',
            right: 0,
            left: 0,
            height: ClowdConstants.navHeight + getStatusBarHeight(),
          }}
        >
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: '#fff',
              opacity: 0.7,
              // borderBottomColor: '#e0e0e0',
              // borderBottomWidth: 1
            }}
          />
        </BlurView>
      </Animated.View>
      <View
        style={{
          height: getStatusBarHeight(),
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // height: clowdStatusBarHeight - statusBarHeight,
          backgroundColor: 'transparent',
          height: 50,
          zIndex: 2,
          // top: getStatusBarHeight()
        }}
      >
        <TouchableHighlight
          style={{
            opacity: canGoBack ? 1 : 0,
            width: 70,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          underlayColor={'transparent'}
          onPress={() => {
            if (canGoBack) {
              if (appContext.navigation) {
                appContext.navigation.goBack()
              }
            }
          }}
        >
          <Image
            source={require('@src/assets/images/go-back-arrow.png')}
            style={{
              width: 20,
              resizeMode: 'contain',
            }}
          />
        </TouchableHighlight>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#000',
          }}
        >
          {appContext.currentFolderName}
        </Text>
        <View
          style={{
            width: 70,
          }}
        ></View>
      </View>

      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          zIndex: 2,
        }}
      >
        <Animated.View
          style={{
            height: 40,
            // transform: [
            //   {
            //     translateY: appContext.scrollY.interpolate({
            //       inputRange: [-9, 0, 40],
            //       outputRange: [3, 0, -20]
            //     })
            //   }
            // ],
            // opacity: appContext.scrollY.interpolate({
            //   inputRange: [-1, 0, 40],
            //   outputRange: [1, 1, 0]
            // })
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              shadowRadius: 5,
              borderRadius: 10,
              marginBottom: 10,
              shadowOpacity: 0.15,
              shadowOffset: {
                width: 0,
                height: 3,
              },
            }}
          >
            <TextInput
              style={{
                color: '#000',
                textAlign: 'center',
                fontSize: 17,
                height: '100%',
              }}
              placeholder="Search files"
              placeholderTextColor="#808080"
              inlineImageLeft="hello"
              selectTextOnFocus={true}
              // onChangeText={onSearch}
              keyboardAppearance="light"
            />
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  )
}

export default ClowdStatusBar
