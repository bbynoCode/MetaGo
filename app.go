package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"os"
	"log"
	"fmt"
	"github.com/dsoprea/go-exif/v3"
	"github.com/dsoprea/go-jpeg-image-structure/v2"
	"github.com/dsoprea/go-png-image-structure/v2"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

var currOpenFile string = ""

func (a *App) SelectFile() string {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a Photo",
	})
	if err != nil {
		return err.Error()
	}

	currOpenFile = file
	fileInfo, err := os.Lstat(file)

	if err != nil {
		return err.Error()
	}

	fileData, err := os.ReadFile(file)
	if err != nil {
		return err.Error()
	}

	var b64encode string

	mimeType := http.DetectContentType(fileData)

	//This is to make sure the file loads correctly when we try to render it in the frontend
	switch mimeType {
	case "image/jpeg":
		b64encode += "data:image/jpeg;base64,"
	case "image/png":
		b64encode += "data:image/png;base64,"
	}

	b64encode += base64.StdEncoding.EncodeToString(fileData)


	// Extract the raw EXIF data
	rawExif, err := exif.SearchAndExtractExif(fileData)
	if err != nil {
		if err == exif.ErrNoExif {
			fmt.Printf("No EXIF data.\n")
			os.Exit(1)
		}
		log.Panic(err)
	}

	// Get the flat EXIF data entries
	entries, _, err := exif.GetFlatExifData(rawExif, nil)
	if err != nil {
		log.Panic(err)
	}

	// Create a map to hold the EXIF data for JSON encoding
	exifData := make(map[string]string)
	for _, tag := range entries {
		exifData[tag.TagName] = tag.Formatted
	}

	// Encode the EXIF data to JSON format
	metaData, err := json.Marshal(exifData)
	if err != nil {
		log.Panic(err)
	}


	jsonObj := map[string]interface{}{
		"success":   true,
		"fileName":  fileInfo.Name(),
		"fileSize":  fileInfo.Size(),
		"filePath":  file,
		"fileBytes": b64encode,
		"fileMetaData": string(metaData),
	}

	jsonBytes, err := json.Marshal(jsonObj)
	if err != nil {
		return err.Error()
	}

	return string(jsonBytes)

}

func (a *App) SaveFile () {


	outputFilePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title: "Save Photo",
	})
	if err != nil {
		log.Panic(err)
	}

	var inputFilePath string = currOpenFile

	// Read the file's data using os.ReadFile
	data, err := os.ReadFile(inputFilePath)
	if err != nil {
		log.Panic(err)
	}

	mimeType := http.DetectContentType(data)

	// Dectect file type
	switch mimeType {
	case "image/jpeg":
		jmp := jpegstructure.NewJpegMediaParser()

		intfc, err := jmp.ParseBytes(data)
		if err != nil {
			os.Exit(-1)
		}
	
		sl := intfc.(*jpegstructure.SegmentList)

		rootIb, err := sl.ConstructExifBuilder()
		if err != nil {
			os.Exit(-1)
		}

		//Remove IFD that contains GPS info
		// Definition of tag ids can be found here https://exiftool.org/TagNames/EXIF.html
		rootIb.DeleteAll(0x8825)
		if err != nil {
			os.Exit(-1)
		}

		err = sl.SetExif(rootIb)
		if err != nil {
			os.Exit(-1)
		}

		f, err := os.OpenFile(outputFilePath, os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			os.Exit(-1)
		}
		defer f.Close()
	
		err = sl.Write(f)
		if err != nil {
			os.Exit(-1)
		}

	case "image/png":
		pmp := pngstructure.NewPngMediaParser()
		intfc, err := pmp.ParseBytes(data)
		if err != nil {
			os.Exit(-1)
		}

		cs := intfc.(*pngstructure.ChunkSlice)
		rootIb, err := cs.ConstructExifBuilder()
		if err != nil {
			os.Exit(-1)
		}

		//Remove IFD that contains GPS info
		// Definition of tag ids can be found here https://exiftool.org/TagNames/EXIF.html
		rootIb.DeleteAll(0x8825)
		if err != nil {
			os.Exit(-1)
		}
		//rootIb.PrintIfdTree()

		err = cs.SetExif(rootIb)
		if err != nil {
			os.Exit(-1)
		}

		f, err := os.OpenFile(outputFilePath, os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			os.Exit(-1)
		}
		defer f.Close()
	
		err = cs.WriteTo(f)
		if err != nil {
			os.Exit(-1)
		}

	}


}