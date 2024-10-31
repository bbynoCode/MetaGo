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

  let renderPhoto;
  if (!fileInfo) {
    renderPhoto = (
      <img src='https://7958737.fs1.hubspotusercontent-na1.net/hubfs/7958737/Imported_Blog_Media/wails-desktop-apps.png' alt="Default" />
    );
  } else {
    renderPhoto = (
      <img src={`data:image/jpeg;base64,${fileInfo.fileBytes}`} alt={fileInfo.fileName} />
    );
  }

  return (
    <>
      <MenueBarUI
        setFileInfo={setFileInfo}
        // @ts-ignore
        fileInfo={fileInfo}
      />

      {renderPhoto}

        <div>
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
            
    </>
  )
}

export default App
