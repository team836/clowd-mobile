import React, { useState, useEffect } from 'react'
import { BlurView } from 'expo-blur'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { View, Text, TouchableHighlight, Image, TextInput } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import {
  FileBrowserScreenParams,
  FileBrowserScreenRouteProp,
  FileBrowserScreenNavigationProp
} from '@src/screen/FileBrowserScreen'
import { RootStackParamList } from '@root/App'

const StatusBar: React.FC = () => {
  const statusBarHeight = getStatusBarHeight()
  const [clowdStatusBarHeight, setStatusBarHeight] = useState(
    getStatusBarHeight() + 50
  )

  const navigation = useNavigation<FileBrowserScreenNavigationProp>()
  const route = useRoute<FileBrowserScreenRouteProp>()
  const folderName = route.params?.folderName
    ? route.params?.folderName
    : 'Clowd'

  return (
    <View
      style={{
        zIndex: 1,
        // height: clowdStatusBarHeight,
        backgroundColor: 'rgba(256,256,256,1)',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8'
      }}
    >
      <View
        style={{
          height: getStatusBarHeight()
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // height: clowdStatusBarHeight - statusBarHeight,
          backgroundColor: 'transparent',
          height: 50
          // top: getStatusBarHeight()
        }}
      >
        <TouchableHighlight
          style={{
            opacity: navigation.canGoBack() ? 1 : 0,
            width: 70,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          underlayColor={'transparent'}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack()
            }
          }}
        >
          <Image
            source={require('@src/assets/images/go-back-arrow.png')}
            style={{
              width: 20,
              resizeMode: 'contain'
            }}
          />
        </TouchableHighlight>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600'
          }}
        >
          {folderName}
        </Text>
        <View
          style={{
            width: 70
          }}
        ></View>
      </View>

      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <TextInput
          placeholder="Search files"
          style={{
            textAlign: 'center',
            fontSize: 17,
            height: 40,
            backgroundColor: '#f0f0f5',
            borderRadius: 10,
            marginBottom: 10
          }}
        />
      </View>
    </View>
  )
}

export default StatusBar
