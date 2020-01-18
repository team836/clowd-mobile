import React, { createContext, useState } from 'react'

export const NavigationContext = createContext('')

export const NavigationProvider: React.FC = props => {
  const [height, setHeight] = useState(50)

  return (
    <NavigationContext.Provider value="">
      {props.children}
    </NavigationContext.Provider>
  )
}
