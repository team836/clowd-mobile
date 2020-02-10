import React, { createContext, useState } from 'react'
import { RouteProp } from '@react-navigation/native'
import { Animated } from 'react-native'
import sampleFileInfo, { FileInfo } from '@src/data/sample-file-info'

interface AppContextProps {
  isNavShrunken: boolean
  setIsNavShrunken: React.Dispatch<React.SetStateAction<boolean>>
  currentFolderName: string
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string>>
  currentPathName: string
  setCurrentPathName: React.Dispatch<React.SetStateAction<string>>
  navigation: any
  setNavigation: React.Dispatch<any>
  scrollY: Animated.Value
  setScrollY: React.Dispatch<React.SetStateAction<Animated.Value>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  fileInfo: FileInfo[]
}

export const AppContext = createContext({} as AppContextProps)

export const AppProvider: React.FC = ({ children }) => {
  const [isNavShrunken, setIsNavShrunken] = useState(false)
  const [currentFolderName, setCurrentFolderName] = useState('Clowd')
  const [currentPathName, setCurrentPathName] = useState('/')
  const [navigation, setNavigation] = useState(null)
  const [scrollY, setScrollY] = useState(new Animated.Value(0))
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [fileInfo, setFileInfo] = useState(sampleFileInfo)

  return (
    <AppContext.Provider
      value={{
        isNavShrunken,
        setIsNavShrunken,
        currentFolderName,
        setCurrentFolderName,
        currentPathName,
        setCurrentPathName,
        navigation,
        setNavigation,
        scrollY,
        setScrollY,
        isSignedIn,
        setIsSignedIn,
        fileInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
