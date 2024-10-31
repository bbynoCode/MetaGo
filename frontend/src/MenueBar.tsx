import { FileInfo } from '@/App';
import { SelectFile } from "../wailsjs/go/main/App"
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
          const file = JSON.parse(fileData) as { fileName: string; fileSize: number; success: boolean, filePath: string, fileBytes: string};
    
          if (!file.success) {
            throw new Error("File selection failed");
          }
          console.log(file.fileBytes)
          setFileInfo({
            fileName: file.fileName,
            fileSize: file.fileSize,
            filePath: file.filePath,
            fileBytes: file.fileBytes
          });

        } catch (error) {
          console.error("Error selecting file:", error);
        }
      };

      return( 
        
        <Menubar>
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={handleSelectFile}>Open File </MenubarItem>
                <MenubarSeparator />
                {/*
                <MenubarItem>Save</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Save As</MenubarItem>
                */}
            </MenubarContent> 
        </MenubarMenu>
        
       {/* <MenubarMenu>
            <MenubarTrigger>Mode</MenubarTrigger>
            <MenubarContent>
                <MenubarItem>Single File </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Multiple File</MenubarItem>
            </MenubarContent>
        </MenubarMenu> */}
        </Menubar>

      )
}

export default MenueBarUI