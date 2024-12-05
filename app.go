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

func (a *App) SelectFile() string {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a Photo",
	})
	if err != nil {
		return err.Error()
	}

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

	// metaDataObj := map[string]interface{}{
	// 	"Camera": "Nikon D3500",
	// 	"Resolution": "6000x4000",
	// 	"ISO": "200",
	// 	"Aperture": "f/5.6",
	// 	"Shutter Speed": "1/200 sec",
	// 	"GPS": "Enabled",
	// 	"Hello": "From Go!",
	// }

	// metaData, err := json.Marshal(metaDataObj)
	// if err != nil {
	// 	return err.Error()
	// }


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