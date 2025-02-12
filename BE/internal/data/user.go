package data

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"time"
	"youneon-BE/internal/validator"
)

var AnonymousUser = &User{}

type User struct {
	ID         uuid.UUID `json:"id"`
	Email      string    `json:"email"`
	FirstName  string    `json:"first-name"`
	LastName   string    `json:"last_name"`
	Password   password  `json:"-"`
	Telephone  string    `json:"telephone"`
	CreatedAt  time.Time `json:"created_at"`
	ModifiedAt time.Time `json:"modified_at"`
}
type UserModel struct {
	DB *sql.DB
}

func (u *User) IsAnonymous() bool {
	return u == AnonymousUser
}

type password struct {
	plaintext *string //Maximum length of 72 bytes, use pointer to hide password
	hash      []byte
}

func (p *password) Set(plaintextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plaintextPassword), 12)
	if err != nil {
		return err
	}
	p.plaintext = &plaintextPassword
	p.hash = hash
	return nil
}

func (p *password) Matches(plaintextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plaintextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}
	return true, nil
}
func ValidateEmail(v *validator.Validator, email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(validator.Matches(email, validator.EmailRX), "email", "must be a valid email address")
}
func ValidatePasswordPlaintext(v *validator.Validator, password string) {
	v.Check(password != "", "password", "must be provided")
	v.Check(len(password) >= 8, "password", "must be at least 8 bytes long")
	v.Check(len(password) <= 72, "password", "must not be more than 72 bytes long")
}
func ValidateUser(v *validator.Validator, user *User) {
	v.Check(user.FirstName != "", "first_name", "must be provided")
	v.Check(len(user.FirstName) <= 500, "first_name", "must not be more than 500 bytes long")
	v.Check(user.LastName != "", "last_name", "must be provided")
	v.Check(len(user.LastName) <= 500, "last_name", "must not be more than 500 bytes long")
	// Call the standalone ValidateEmail() helper.
	ValidateEmail(v, user.Email)
	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
	}
	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}

func (m UserModel) Insert(user *User) error {
	query := `
		INSERT INTO users (email, first_name, last_name, telephone, password_hash)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id`

	if user.Telephone == "" {
		user.Telephone = "0"
	}
	args := []interface{}{user.Email, user.FirstName, user.LastName, user.Telephone, user.Password.hash}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&user.ID)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "user_username_key"`:
			return ErrDuplicateEmail
		default:
			return err
		}
	}
	return nil
}
func (m UserModel) GetByEmail(email string) (*User, error) {
	query := `
		SELECT id, email, first_name, last_name,telephone, password_hash, created_at, modified_at
		FROM users
		WHERE email = $1`
	var user User
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, email).Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.Telephone, &user.Password.hash, &user.CreatedAt, &user.ModifiedAt)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &user, nil
}
func (m UserModel) Update(user *User) error {
	query := `
		UPDATE users
		SET email = $1,first_name = $2, last_name = $3, telephone = $4, password_hash = $5, modified_at = $6
		WHERE id = $7`
	args := []interface{}{user.Email, user.FirstName, user.LastName, user.Telephone, user.Password.hash, time.Now(), user.ID}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "user_username_key"`:
			return ErrDuplicateEmail
		default:
			return err
		}
	}
	return nil
}
func (m UserModel) Get(id uuid.UUID) (*User, error) {
	query := `
        SELECT id, email, first_name, last_name,telephone, password_hash, created_at, modified_at
		FROM users
		WHERE id = $1`
	var user User
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, id.String()).Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Telephone,
		&user.Password.hash,
		&user.CreatedAt,
		&user.ModifiedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &user, nil
}
