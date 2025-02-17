package data

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type OrderItem struct {
	ID        uuid.UUID `json:"id"`
	OrderID   uuid.UUID `json:"order_id"`
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

type OrderItemModel struct {
	DB *sql.DB
}

func (m OrderItemModel) Insert(orderItem *OrderItem) (*uuid.UUID, error) {
	query := `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) returning id`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	var id *uuid.UUID
	err := m.DB.QueryRowContext(ctx, query, orderItem.OrderID, orderItem.ProductID, orderItem.Quantity).Scan(&id)
	if err != nil {
		return &uuid.Nil, err
	}
	return id, nil
}

func (m OrderItemModel) GetAllByOrderID(id uuid.UUID) ([]*OrderItem, error) {
	query := `SELECT id, order_id, product_id, quantity FROM order_items WHERE order_id = $1`
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
	var orderItems []*OrderItem
	for rows.Next() {
		var orderItem OrderItem
		err := rows.Scan(&orderItem.ID, &orderItem.OrderID, &orderItem.ProductID, &orderItem.Quantity)
		if err != nil {
			return nil, err
		}
		orderItems = append(orderItems, &orderItem)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return orderItems, nil
}
