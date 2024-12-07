import MenueBarUI from './MenueBar'
import MetaDataTable from './MetaDataTable'
import { useState } from "react"

export interface FileInfo {
  fileName: string
  fileSize: number
  filePath: string
  fileBytes: string
  fileMetaData: string
}


function App() {

  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)

  // const metadata = {
  //   "Photo": "Not Loaded"
  // };


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

  let parsedMetaData;
  try {
    parsedMetaData = fileInfo?.fileMetaData ? JSON.parse(fileInfo.fileMetaData) : undefined;
  } catch (error) {
    console.error("Invalid metadata JSON:", error);
    parsedMetaData = undefined;
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
              
              {/* <div className="w-1/2 ml-4">
                  <h2 className="text-lg font-semibold mb-2">Photo Meta Data</h2>
                  <table className="min-w-full text-left">
                      <tbody>
                        <MetaDataTable metadata={parsedMetaData} />
                      </tbody>
                  </table>
              </div> */}

<             div className="w-1/2 ml-4">
                <h2 className="text-lg font-semibold mb-2">Photo Meta Data</h2>
                <div className="overflow-y-scroll max-h-[400px] border rounded-md p-2">
                  <table className="min-w-full text-left">
                    <tbody>
                      <MetaDataTable metadata={parsedMetaData} />
                    </tbody>
                  </table>
                </div>
              </div>


          </div>
          
          <div className="flex justify-center mt-6">
            <label className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-md border">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-400" />
              <span className="text-gray-700 font-medium">Remove GPS Data</span>
            </label>
          </div>
          
        </div>
      </div>
            
    </>
  )
}

export default App
