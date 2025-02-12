package main

import (
	"net/http"
	"youneon-BE/internal/data"
	"youneon-BE/internal/validator"
)

// @Summary Get all addresses by user id
// @Description Get all addresses by user id
// @Tags addresses
// @Accept json
// @Produce json
// @Success 200 {object} envelope
// @Security ApiKeyAuth
// @Router /addresses [get]
func (app *application) getAddressesByUserId(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	addresses, err := app.models.Address.GetAllByUserID(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"addresses": addresses}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

type AddressRequest struct {
	City        string `json:"city"`
	District    string `json:"district"`
	Ward        string `json:"ward"`
	Detail      string `json:"detail"`
	Telephone   string `json:"telephone"`
	Receiver    string `json:"receiver"`
	Description string `json:"description"`
}

// @Summary Create an address
// @Description Create an address
// @Tags addresses
// @Accept json
// @Produce json
// @Param address body AddressRequest true "address"
// @Success 201 {object} envelope
// @Security ApiKeyAuth
// @Router /addresses [post]
func (app *application) createAddressHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	var input AddressRequest
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	address := &data.Address{
		UserId:      user.ID,
		City:        input.City,
		District:    input.District,
		Ward:        input.Ward,
		Detail:      input.Detail,
		Telephone:   input.Telephone,
		Receiver:    input.Receiver,
		Description: input.Description,
	}
	v := validator.New()
	if data.ValidateAddress(v, address); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	err = app.models.Address.Insert(address)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"address": address}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Update an address
// @Description Update an address
// @Tags addresses
// @Accept json
// @Produce json
// @Param id path string true "address id"
// @Param address body AddressRequest true "address"
// @Success 200 {object} envelope
// @Security ApiKeyAuth
// @Router /addresses/{id} [put]
func (app *application) updateAddressHandler(w http.ResponseWriter, r *http.Request) {
	var input AddressRequest
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	paramId, err := app.readUUIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	address, err := app.models.Address.Get(paramId)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	address.City = input.City
	address.District = input.District
	address.Ward = input.Ward
	address.Detail = input.Detail
	address.Telephone = input.Telephone
	address.Receiver = input.Receiver
	address.Description = input.Description
	v := validator.New()
	if data.ValidateAddress(v, address); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	err = app.models.Address.Update(address)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"address": address}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Delete an address
// @Description Delete an address
// @Tags addresses
// @Accept json
// @Produce json
// @Param id path string true "address id"
// @Success 200 {object} envelope
// @Security ApiKeyAuth
// @Router /addresses/{id} [delete]
func (app *application) deleteAddressHandler(w http.ResponseWriter, r *http.Request) {
	paramId, err := app.readUUIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	err = app.models.Address.Delete(paramId)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"message": "deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
