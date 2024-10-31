import MenueBarUI from './MenueBar'
import { useState } from "react"

export interface FileInfo {
  fileName: string
  fileSize: number
  filePath: string
  fileBytes: string
}


function App() {

  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)

  return (
    <>
      <MenueBarUI
        setFileInfo={setFileInfo}
        // @ts-ignore
        fileInfo={fileInfo}
      />

        <div>
        
        </div>
        <div className="columns-2">
          <div className="container">
            <img src={`data:image/jpeg;base64,${fileInfo?.fileBytes}`} />
          </div>
    
          <div className="container bg-sky-100">
            <table className="table-auto align-center">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Test Key</td>
                  <td>Test Value</td>
                </tr>
                <tr>
                  <td>Test Key</td>
                  <td>Test Value</td>
                </tr>
                <tr>
                  <td>Test Key</td>
                  <td>Test Value</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default App
