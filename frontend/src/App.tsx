import MenueBarUI from './MenueBar'
import MetaDataTable from './MetaDataTable'
import { useState } from "react"

export interface FileInfo {
  fileName: string
  fileSize: number
  filePath: string
  fileBytes: string
}


function App() {

  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)

  const metadata = {
    "Camera": "Nikon D3500",
    "Resolution": "6000x4000",
    "ISO": "200",
    "Aperture": "f/5.6",
    "Shutter Speed": "1/200 sec",
    "GPS": "Enabled"
  };


  let renderPhoto;
  if (!fileInfo) {
    renderPhoto = (
      <div className="w-1/2 border rounded-md h-80 bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">Photo rendered here</p>
      </div>
    );
  } else {
    renderPhoto = (
      <div className="p-2 bg-gray-200 rounded-md border flex items-center justify-center">
        <img
          src={`${fileInfo.fileBytes}`}
          alt={fileInfo.fileName}
          className="max-w-full max-h-full"
        />
      </div>
    );
  }

  return (
    <>


      <div>
        <MenueBarUI
          setFileInfo={setFileInfo}
          // @ts-ignore
          fileInfo={fileInfo}
        />
        <div >
          <div className="flex">
              
              {renderPhoto}
              
              <div className="w-1/2 ml-4">
                  <h2 className="text-lg font-semibold mb-2">Photo Meta Data</h2>
                  <table className="min-w-full text-left">
                      <tbody>
                        <MetaDataTable metadata={metadata} />
                      </tbody>
                  </table>
              </div>
          </div>
          
          
          <div className="flex justify-between items-center mt-6">
              <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                    <span>Remove GPS Data</span>
              </label>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md">Button</button>
          </div>
        </div>
      </div>
            
    </>
  )
}

export default App
