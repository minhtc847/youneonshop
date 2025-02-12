package main

import (
	"errors"
	"net/http"
	"youneon-BE/internal/data"
	"youneon-BE/internal/validator"
)

type ListProductsRequest struct {
	Category  string
	Tags      []string
	Name      string
	PriceFrom int
	PriceTo   int
	data.Filters
}

// @Summary List products
// @Description Get a list of products, sorted by "name", "price", "modified_at", "-name", "-price", "-modified_at"
// @Tags products
// @Accept json
// @Produce json
// @Param category query string false "Category"
// @Param tags query []string false "Tags"
// @Param name query string false "Name"
// @Param price_from query int false "Price from"
// @Param price_to query int false "Price to"
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param sort query string false "Sort"
// @Success 200 {object} envelope
// @Router /products [get]
func (app *application) listProductHandler(w http.ResponseWriter, r *http.Request) {
	var input ListProductsRequest

	v := validator.New()
	qs := r.URL.Query()

	// Read query parameters
	input.Category = app.readString(qs, "category", "")
	input.Tags = app.readCSV(qs, "tags", []string{})
	input.Name = app.readString(qs, "name", "")
	input.PriceFrom = app.readInt(qs, "price_from", 0, v)
	input.PriceTo = app.readInt(qs, "price_to", 900000000, v)

	input.Page = app.readInt(qs, "page", 1, v)
	input.PageSize = app.readInt(qs, "page_size", 20, v)
	input.Sort = app.readString(qs, "sort", "name")
	input.SortSafelist = []string{"name", "price", "modified_at", "-name", "-price", "-modified_at"}

	// Validate filters
	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	// Call the GetAll method on the ProductModel
	products, metadata, err := app.models.Products.GetAll(
		input.Filters,
		input.Category,
		input.Tags,
		input.Name,
		input.PriceFrom,
		input.PriceTo,
	)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// Write the JSON response
	err = app.writeJSON(w, http.StatusOK, envelope{
		"products": products,
		"metadata": metadata,
	}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Get a product
// @Description Get a product by ID
// @Tags products
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} envelope
// @Router /products/{id} [get]
func (app *application) getProductHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readUUIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	product, err := app.models.Products.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"product": product}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Get all categories
// @Description Get all categories
// @Tags products
// @Accept json
// @Produce json
// @Success 200 {object} envelope
// @Router /categories [get]
func (app *application) getAllCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := app.models.Categories.GetAll()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	listCategories := make([]string, len(categories))
	for i, category := range categories {
		listCategories[i] = category.Name
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"categories": listCategories}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// @Summary Get all tags
// @Description Get all tags
// @Tags products
// @Accept json
// @Produce json
// @Success 200 {object} envelope
// @Router /tags [get]
func (app *application) getAllTags(w http.ResponseWriter, r *http.Request) {
	tags, err := app.models.Tags.GetAll()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	listTags := make([]string, len(tags))
	for i, tag := range tags {
		listTags[i] = tag.Name
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"tags": listTags}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
