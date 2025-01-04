package main

import (
	"context"
	"net/http"
	"youneon-BE/internal/data"
)

type contextKey string

const userContextKey = contextKey("user")

func (app *application) contextSetUser(r *http.Request, user *data.User) *http.Request {
	ctx := context.WithValue(r.Context(), userContextKey, user)
	return r.WithContext(ctx)
}

func (app *application) contextGetUser(r *http.Request) *data.User {
	user, ok := r.Context().Value(userContextKey).(*data.User)
	if !ok {
		panic("missing user value in request context")
	}
	return user
}
func (app *application) contextSetToken(r *http.Request, token string) *http.Request {
	ctx := context.WithValue(r.Context(), "token", token)
	return r.WithContext(ctx)
}

func (app *application) contextGetToken(r *http.Request) string {
	token, ok := r.Context().Value("token").(string)
	if !ok {
		panic("missing token value in request context")
	}
	return token
}
