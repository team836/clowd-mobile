import { FileInfo } from '@src/data/sample-file-info'
import { AppContext } from '@src/context/AppContext'
import { useContext } from 'react'

const addFile = (file: FileInfo) => {
  const appContext = useContext(AppContext)
  const newFileInfo = [...appContext.fileInfo]
  newFileInfo.push(file)
  appContext.setFileInfo(newFileInfo)
}

export default addFile
