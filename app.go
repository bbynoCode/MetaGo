package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
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

	fileData, err := ioutil.ReadFile(file)
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

	metaDataObj := map[string]interface{}{
		"Camera": "Nikon D3500",
		"Resolution": "6000x4000",
		"ISO": "200",
		"Aperture": "f/5.6",
		"Shutter Speed": "1/200 sec",
		"GPS": "Enabled",
		"Hello": "From Go!",
	}

	metaData, err := json.Marshal(metaDataObj)
	if err != nil {
		return err.Error()
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