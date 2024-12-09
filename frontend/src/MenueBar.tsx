import { FileInfo } from '@/App';
import { SelectFile } from "../wailsjs/go/main/App"
import { SaveFile } from "../wailsjs/go/main/App"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
  } from "@/components/ui/menubar"


const MenueBarUI = ({
    setFileInfo,
}:{
    setFileInfo: (fileInfo: FileInfo | null) => void
    fileInfo: FileInfo | null
}) => {

    const handleSelectFile = async () => {
    
        try {
          const fileData = await SelectFile();
          const file = JSON.parse(fileData) as { fileName: string; fileSize: number; success: boolean, filePath: string, fileBytes: string, fileMetaData : string};
    
          if (!file.success) {
            throw new Error("File selection failed");
          }

          setFileInfo({
            fileName: file.fileName,
            fileSize: file.fileSize,
            filePath: file.filePath,
            fileBytes: file.fileBytes,
            fileMetaData: file.fileMetaData
          });

        } catch (error) {
          console.error("Error selecting file:", error);
        }
      };

    const handleSaveFile = async () => {
  
      try {
        await SaveFile(); // Call your save function with file path
      } catch (error) {
        console.error("Error saving file:", error);
      }
    };

      return( 
        
        <Menubar>
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={handleSelectFile}>Open File </MenubarItem>
                <MenubarSeparator />
                
                <MenubarItem onClick={handleSaveFile}>Save File</MenubarItem>
               
            </MenubarContent> 
        </MenubarMenu>
        </Menubar>

      )
}

export default MenueBarUI