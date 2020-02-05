import React, { createContext, useState } from 'react'
import { RouteProp } from '@react-navigation/native'
import { Animated } from 'react-native'

interface AppContextProps {
  isNavShrunken: boolean
  setIsNavShrunken: React.Dispatch<React.SetStateAction<boolean>>
  currentFolderName: string
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string>>
  navigation: any
  setNavigation: React.Dispatch<any>
  scrollY: Animated.Value
  setScrollY: React.Dispatch<React.SetStateAction<Animated.Value>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext({} as AppContextProps)

export const AppProvider: React.FC = ({ children }) => {
  const [isNavShrunken, setIsNavShrunken] = useState(false)
  const [currentFolderName, setCurrentFolderName] = useState('Clowd')
  const [navigation, setNavigation] = useState(null)
  const [scrollY, setScrollY] = useState(new Animated.Value(0))
  const [isSignedIn, setIsSignedIn] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isNavShrunken,
        setIsNavShrunken,
        currentFolderName,
        setCurrentFolderName,
        navigation,
        setNavigation,
        scrollY,
        setScrollY,
        isSignedIn,
        setIsSignedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
