package main

import (
	"errors"
	"net/http"
	"youneon-BE/internal/data"
	"youneon-BE/internal/validator"
)

type UserRequest struct {
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
}

// @Summary Register a user
// @Description Create a new user
// @Tags users
// @Accept json
// @Produce json
// @Param user body UserRequest true "register user"
// @Success 200 {object} data.User
// @Router /users [post]
func (app *application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	user := &data.User{
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Email:     input.Email,
	}
	err = user.Password.Set(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	v := validator.New()
	if data.ValidateUser(v, user); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	err = app.models.Users.Insert(user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateEmail):
			v.AddError("email", "a user with this email address already exists")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	newUser, err := app.models.Users.GetByEmail(user.Email)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"user": newUser}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// create login handler
//func (app *application) loginUserHandler(w http.ResponseWriter, r *http.Request) {
//	var input struct {
//		Email    string `json:"email"`
//		Password string `json:"password"`
//	}
//	err := app.readJSON(w, r, &input)
//	if err != nil {
//		app.badRequestResponse(w, r, err)
//		return
//	}
//	v := validator.New()
//	if data.ValidateEmail(v, input.Email); !v.Valid() {
//		app.failedValidationResponse(w, r, v.Errors)
//		return
//	}
//	user, err := app.models.Users.GetByEmail(input.Email)
//	if err != nil {
//		switch {
//		case errors.Is(err, data.ErrRecordNotFound):
//			app.invalidCredentialsResponse(w, r)
//		default:
//			app.serverErrorResponse(w, r, err)
//		}
//		return
//	}
//	match, err := user.Password.Matches(input.Password)
//	if err != nil {
//		app.serverErrorResponse(w, r, err)
//		return
//	}
//	if !match {
//		app.invalidCredentialsResponse(w, r)
//		return
//	}
//	if !user.Activated {
//		app.inactiveAccountResponse(w, r)
//		return
//	}
//	token, err := app.createAuthenticationJWTTokenHandler(user.ID, 3*24*time.Hour, data.ScopeAuthentication)
//	if err != nil {
//		app.serverErrorResponse(w, r, err)
//		return
//	}
//	err = app.writeJSON(w, http.StatusOK, envelope{
//		"authenticationToken": token,
//		"user":                user,
//	}, nil)
//	if err != nil {
//		app.serverErrorResponse(w, r, err)
//	}
//}
