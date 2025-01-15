package data

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"time"
)

type CartItem struct {
	Id        uuid.UUID `json:"id"`
	UserId    uuid.UUID `json:"user_id"`
	ProductId uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type CartItemModel struct {
	DB *sql.DB
}

func (m CartItemModel) Insert(cartItem *CartItem) error {
	query := `INSERT INTO cart_item (user_id, product_id, quantity) VALUES ($1, $2, $3)`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, cartItem.UserId, cartItem.ProductId, cartItem.Quantity)
	if err != nil {
		return err
	}
	return nil
}
func (m CartItemModel) Delete(userId uuid.UUID, productId uuid.UUID) error {
	query := `DELETE FROM cart_item WHERE user_id = $1 AND product_id = $2`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, userId, productId)
	if err != nil {
		return err
	}
	return nil
}

func (m CartItemModel) Update(cartItem *CartItem) error {
	query := `UPDATE cart_item SET quantity = $1 WHERE user_id = $2 AND product_id = $3`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, cartItem.Quantity, cartItem.UserId, cartItem.ProductId)
	if err != nil {
		return err
	}
	return nil
}

func (m CartItemModel) GetQuantity(userId uuid.UUID, productId uuid.UUID) (int, error) {
	query := `SELECT quantity FROM cart_item WHERE user_id = $1 AND product_id = $2`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	var quantity int
	err := m.DB.QueryRowContext(ctx, query, userId, productId).Scan(&quantity)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, nil
		}
		return 0, err
	}
	return quantity, nil
}

func (m CartItemModel) GetAllByUserID(id uuid.UUID) ([]*CartItem, error) {
	query := `SELECT id, user_id, product_id, quantity FROM cart_item WHERE user_id = $1`
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
	var cartItems []*CartItem
	for rows.Next() {
		var cartItem CartItem
		err := rows.Scan(&cartItem.Id, &cartItem.UserId, &cartItem.ProductId, &cartItem.Quantity)
		if err != nil {
			return nil, err
		}
		cartItems = append(cartItems, &cartItem)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return cartItems, nil
}
