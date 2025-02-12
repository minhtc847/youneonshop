package main

import (
	"errors"
	"github.com/google/uuid"
	"net/http"
	"youneon-BE/internal/data"
	"youneon-BE/internal/validator"
)

type CartRequest struct {
	ProductId string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

// @Summary Insert a cart item
// @Description Insert a cart item
// @Tags carts
// @Accept json
// @Produce json
// @Param input body CartRequest true "Cart request"
// @Success 200 {object} envelope
// @Router /carts [post]
func (app *application) insertCartHandler(w http.ResponseWriter, r *http.Request) {
	var input CartRequest
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	v := validator.New()
	v.Check(input.Quantity > 0, "quantity", "must be greater than zero")
	v.Check(input.ProductId != "", "product_id", "must be provided")
	v.Check(input.Quantity < 100, "quantity", "must be less than 100")
	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	user := app.contextGetUser(r)
	if user == data.AnonymousUser {
		app.authenticationRequiredResponse(w, r)
		return
	}

	productId, err := uuid.Parse(input.ProductId)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	itemQuantity, err := app.models.CartItems.GetQuantity(user.ID, productId)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	item := data.CartItem{
		UserId:    user.ID,
		ProductId: productId,
		Quantity:  input.Quantity + itemQuantity,
	}
	if itemQuantity > 0 {
		err = app.models.CartItems.Update(&item)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	} else {
		err = app.models.CartItems.Insert(&item)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "Added to cart"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

type CartItemResponse struct {
	ProductId   string  `json:"product_id"`
	ProductName string  `json:"product_name"`
	Price       int     `json:"price"`
	Image       *string `json:"image"`
	Quantity    int     `json:"quantity"`
}

// @Summary Get cart items
// @Description Get cart items
// @Tags carts
// @Accept json
// @Produce json
// @Success 200 {object} envelope
// @Router /carts [get]
func (app *application) getCartHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user == data.AnonymousUser {
		app.authenticationRequiredResponse(w, r)
		return
	}
	items, err := app.models.CartItems.GetAllByUserID(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	cartItems := make([]CartItemResponse, 0, len(items))
	for _, item := range items {
		product, err := app.models.Products.Get(item.ProductId)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		cartItems = append(cartItems, CartItemResponse{
			ProductId:   item.ProductId.String(),
			ProductName: product.Name,
			Price:       product.Price,
			Image:       product.Image,
			Quantity:    item.Quantity,
		})
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"cart": cartItems}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Remove a cart item
// @Description Remove a cart item
// @Tags carts
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} envelope
// @Router /carts/{id} [delete]
func (app *application) removeCartItemHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user == data.AnonymousUser {
		app.authenticationRequiredResponse(w, r)
		return
	}
	productId, err := app.readUUIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	itemQuantity, err := app.models.CartItems.GetQuantity(user.ID, productId)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	if itemQuantity < 1 {
		app.errorResponse(w, r, http.StatusUnprocessableEntity, "Item not in cart")
		return
	}

	err = app.models.CartItems.Delete(user.ID, productId)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"message": "Removed from cart"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Update a cart item
// @Description Update a cart item
// @Tags carts
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Param quantity body CartRequest true "Quantity"
// @Success 200 {object} envelope
// @Router /carts/{id} [put]
func (app *application) updateCartItemHandler(w http.ResponseWriter, r *http.Request) {
	var input CartRequest
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	paramId, err := app.readUUIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	if paramId.String() != input.ProductId {
		app.badRequestResponse(w, r, errors.New("ProductId does not match"))
		return
	}
	v := validator.New()
	v.Check(input.Quantity > 0, "quantity", "must be greater than zero")
	v.Check(input.Quantity < 100, "quantity", "must be less than 100")
	v.Check(input.ProductId != "", "product_id", "must be provided")
	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	user := app.contextGetUser(r)
	if user == data.AnonymousUser {
		app.authenticationRequiredResponse(w, r)
		return
	}
	productId, err := uuid.Parse(input.ProductId)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	itemQuantity, err := app.models.CartItems.GetQuantity(user.ID, productId)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	if itemQuantity < 1 {
		app.errorResponse(w, r, http.StatusUnprocessableEntity, "Item not in cart")
		return
	}
	item := data.CartItem{
		UserId:    user.ID,
		ProductId: productId,
		Quantity:  input.Quantity,
	}
	err = app.models.CartItems.Update(&item)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"message": "Updated cart"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
