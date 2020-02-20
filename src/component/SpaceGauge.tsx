import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import { ClowdConstants } from '@src/constants'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { View, Text } from 'react-native'
import * as FileSystem from 'expo-file-system'

const SpaceGauge: React.FC = () => {
  const [totalSpace, setTotalSpace] = useState(0)
  const [freeSpace, setFreeSpace] = useState(0)
  ;(async () => {
    setTotalSpace((await FileSystem.getTotalDiskCapacityAsync()) / 1024 ** 3)
    setFreeSpace((await FileSystem.getFreeDiskStorageAsync()) / 1024 ** 3)
  })()

  return (
    <BlurView
      tint="default"
      intensity={100}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        height: ClowdConstants.gaugeHeight + getBottomSpace(),
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <View
        style={{
          backgroundColor: '#f3f4f5',
          opacity: 0.7,
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          height: ClowdConstants.gaugeHeight,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 4,
            borderRadius: 10,
            position: 'relative',
            backgroundColor: '#fff',
            overflow: 'hidden',
            justifyContent: 'flex-start',
          }}
        >
          <View
            style={{
              backgroundColor: '#0E85F3',
              height: '100%',
              width: `${((totalSpace - freeSpace) / totalSpace) * 100}%`,
            }}
          ></View>
        </View>
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 13,
            }}
          >
            {(totalSpace - freeSpace).toFixed(1)}GB /{' '}
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 13,
            }}
          >
            {totalSpace.toFixed(1)}GB
          </Text>
        </View>
      </View>
    </BlurView>
  )
}

export default SpaceGauge
