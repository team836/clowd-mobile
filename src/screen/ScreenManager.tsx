import React, { useContext } from 'react'
import StartScreen from '@src/screen/StartScreen'
import MainScaffold from '@src/component/MainScaffold'
import { AppContext } from '@src/context/AppContext'

const ScreenManager: React.FC = () => {
  // TODO: Check authentication and decide which screen to display

  const appContext = useContext(AppContext)

  return <>{appContext.isSignedIn ? <MainScaffold /> : <StartScreen />}</>
}

export default ScreenManager
