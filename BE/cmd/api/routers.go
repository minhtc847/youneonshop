package main

import (
	"github.com/julienschmidt/httprouter"
	httpSwagger "github.com/swaggo/http-swagger"
	"net/http"
	_ "youneon-BE/docs"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)
	router.Handler(http.MethodGet, "/swagger/*any", httpSwagger.WrapHandler)

	router.HandlerFunc(http.MethodPost, "/users", app.registerUserHandler)

	router.HandlerFunc(http.MethodPost, "/users/login", app.createAuthenticationJWTTokenHandler)
	router.HandlerFunc(http.MethodGet, "/users/logout", app.requireAuthenticatedUser(app.logoutHandler))

	router.HandlerFunc(http.MethodGet, "/products/:id", app.getProductHandler)
	router.HandlerFunc(http.MethodGet, "/products", app.listProductHandler)

	router.HandlerFunc(http.MethodGet, "/tags", app.getAllTags)

	router.HandlerFunc(http.MethodGet, "/categories", app.getAllCategories)

	return app.enableCORS(app.authenticate(router))

}
