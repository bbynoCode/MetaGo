
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Separator } from "@/components/ui/separator"


function App() {
  return (
  <div>
    <div>
      <Menubar>
          <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                  <button >
                      <MenubarItem>Open File </MenubarItem>
                  </button >
                
                  <MenubarSeparator />
                  <MenubarItem>Save</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Save As</MenubarItem>
              </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
              <MenubarTrigger>Mode</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem>Single File </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Multiple File</MenubarItem>
              </MenubarContent>
          </MenubarMenu>
      </Menubar>
      <Separator />

    </div>
    <div className="columns-2">
      <div className="container">
        <img src="https://www.encora.com/hubfs/Imported_Blog_Media/wails-desktop-apps.png"/>
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
    
    
  </div>

  )
}

export default App
