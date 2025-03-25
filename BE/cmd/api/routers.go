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
	router.HandlerFunc(http.MethodGet, "/user", app.requireAuthenticatedUser(app.getUserHandler))

	router.HandlerFunc(http.MethodGet, "/products/:id", app.getProductHandler)
	router.HandlerFunc(http.MethodGet, "/products", app.listProductHandler)

	router.HandlerFunc(http.MethodGet, "/tags", app.getAllTags)

	router.HandlerFunc(http.MethodGet, "/categories", app.getAllCategories)

	router.HandlerFunc(http.MethodGet, "/carts", app.requireAuthenticatedUser(app.getCartHandler))
	router.HandlerFunc(http.MethodPost, "/carts", app.requireAuthenticatedUser(app.insertCartHandler))
	router.HandlerFunc(http.MethodDelete, "/carts/:id", app.requireAuthenticatedUser(app.removeCartItemHandler))
	router.HandlerFunc(http.MethodPut, "/carts/:id", app.requireAuthenticatedUser(app.updateCartItemHandler))

	router.HandlerFunc(http.MethodGet, "/addresses", app.requireAuthenticatedUser(app.getAddressesByUserId))
	router.HandlerFunc(http.MethodPost, "/addresses", app.requireAuthenticatedUser(app.createAddressHandler))
	router.HandlerFunc(http.MethodDelete, "/addresses/:id", app.requireAuthenticatedUser(app.deleteAddressHandler))
	router.HandlerFunc(http.MethodPut, "/addresses/:id", app.requireAuthenticatedUser(app.updateAddressHandler))

	router.HandlerFunc(http.MethodPost, "/orders", app.requireAuthenticatedUser(app.createOrderHandler))
	//
	//router.HandlerFunc(http.MethodPost, "/shorten", app.createShortenHandler)
	//router.HandlerFunc(http.MethodGet, "/:shortID", app.redirectHandler)
	return app.enableCORS(app.authenticate(router))

}
