package main

import (
	"github.com/google/uuid"
	"net/http"
)

func (app *application) createShortenHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		URL string `json:"url"`
	}
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	var existedURL bool
	if existedURL, _ = app.models.Shortener.IsLongURLExists(input.URL); existedURL {
		app.errorResponse(w, r, http.StatusUnprocessableEntity, "URL already exists")
		return
	}
	shortID := uuid.New().String()[:6]
	newShorten, err := app.models.Shortener.CreateShortener(input.URL, shortID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusCreated, envelope{"shorten": newShorten}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
func (app *application) redirectHandler(w http.ResponseWriter, r *http.Request) {
	shortID := r.URL.Path[1:]
	shorten, err := app.models.Shortener.GetShortener(shortID)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	http.Redirect(w, r, shorten.LongURL, http.StatusFound)
}
