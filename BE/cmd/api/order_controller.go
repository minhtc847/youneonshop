package main

import (
	"net/http"
	"youneon-BE/internal/data"
)

type OrderRequest struct {
	Total         int    `json:"total"`
	AddressDetail string `json:"address_detail"`
}

// @Summary Create a new order
// @Description Create a new order
// @Tags orders
// @Accept json
// @Produce json
// @Param input body OrderRequest true "Order request"
// @Success 200 {object} data.OrderDetail
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /orders [post]
func (app *application) createOrderHandler(w http.ResponseWriter, r *http.Request) {
	var input OrderRequest
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	user := app.contextGetUser(r)
	if user == data.AnonymousUser {
		app.authenticationRequiredResponse(w, r)
		return
	}
	newOrderDetail := &data.OrderDetail{
		Total:         input.Total,
		AddressDetail: input.AddressDetail,
		UserId:        user.ID,
		Status:        "pending",
	}
	newOrderId, err := app.models.OrderDetail.Insert(newOrderDetail)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	cartItems, err := app.models.CartItems.GetAllByUserID(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	for _, cartItem := range cartItems {
		newOrderItem := &data.OrderItem{
			ProductID: cartItem.ProductId,
			OrderID:   *newOrderId,
			Quantity:  cartItem.Quantity,
		}
		_, err := app.models.OrderItem.Insert(newOrderItem)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		err = app.models.CartItems.Delete(user.ID, cartItem.ProductId)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}
	err = app.writeJSON(w, http.StatusCreated, envelope{"order": newOrderDetail}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
