package data

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"time"
	"youneon-BE/internal/validator"
)

type Address struct {
	Id          uuid.UUID `json:"id"`
	UserId      uuid.UUID `json:"user_id"`
	City        string    `json:"city"`
	District    string    `json:"district"`
	Ward        string    `json:"ward"`
	Detail      string    `json:"detail"`
	Telephone   string    `json:"telephone"`
	Receiver    string    `json:"receiver"`
	Description string    `json:"description"`
}
type AddressModel struct {
	DB *sql.DB
}

func ValidateAddress(v *validator.Validator, address *Address) {
	v.Check(len(address.Detail) <= 1500, "detail", "must not be more than 1500 bytes long")
	v.Check(address.Telephone != "", "telephone", "must be provided")
	v.Check(len(address.Telephone) <= 500, "telephone", "must not be more than 500 bytes long")
	v.Check(address.Receiver != "", "receiver", "must be provided")
	v.Check(len(address.Receiver) <= 500, "receiver", "must not be more than 500 bytes long")
}

func (m AddressModel) Insert(address *Address) error {
	query := `
		INSERT INTO user_address (user_id, city, district, ward, detail, telephone, receiver, description)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, address.UserId, address.City, address.District, address.Ward, address.Detail, address.Telephone, address.Receiver, address.Description)
	if err != nil {
		return err
	}
	return nil
}
func (m AddressModel) GetAllByUserID(id uuid.UUID) ([]*Address, error) {
	query := `SELECT id, user_id, city, district, ward, detail, telephone, receiver, description FROM user_address WHERE user_id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			return
		}
	}(rows)
	var addresses []*Address
	for rows.Next() {
		var address Address
		err := rows.Scan(&address.Id, &address.UserId, &address.City, &address.District, &address.Ward, &address.Detail, &address.Telephone, &address.Receiver, &address.Description)
		if err != nil {
			return nil, err
		}
		addresses = append(addresses, &address)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return addresses, nil
}
func (m AddressModel) Get(id uuid.UUID) (*Address, error) {
	query := `SELECT id, user_id, city, district, ward, detail, telephone, receiver, description FROM user_address WHERE id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	var address Address
	row := m.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(&address.Id, &address.UserId, &address.City, &address.District, &address.Ward, &address.Detail, &address.Telephone, &address.Receiver, &address.Description)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &address, nil
}

func (m AddressModel) Delete(id uuid.UUID) error {
	query := `DELETE FROM user_address WHERE id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
func (m AddressModel) Update(address *Address) error {
	query := `UPDATE user_address SET city = $1, district = $2, ward = $3, detail = $4, telephone = $5, receiver = $6, description = $7 WHERE id = $8`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, address.City, address.District, address.Ward, address.Detail, address.Telephone, address.Receiver, address.Description, address.Id)
	if err != nil {
		return err
	}
	return nil
}
