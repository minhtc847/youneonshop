package data

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type Category struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	CreateAt    time.Time `json:"created_at"`
	ModifiedAt  time.Time `json:"modified_at"`
	IsDeleted   bool      `json:"is_deleted"`
}

type CategoryModel struct {
	DB *sql.DB
}

func (m CategoryModel) Insert(category *Category) error {
	query := `INSERT INTO product_category(name, description)
	VALUES ($1, $2)
		RETURNING id`
	args := []interface{}{category.Name, category.Description}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&category.ID)
	if err != nil {
		return err
	}
	return nil
}
func (m CategoryModel) Get(id uuid.UUID) (*Category, error) {
	query := `SELECT id, name, description, created_at, modified_at, is_deleted
	FROM product_category
	WHERE id = $1`
	var category Category
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, id).Scan(&category.ID, &category.Name, &category.Description, &category.CreateAt, &category.ModifiedAt, &category.IsDeleted)
	if err != nil {
		return nil, err
	}
	return &category, nil
}
func (m CategoryModel) Update(category *Category) error {
	query := `UPDATE product_category
	SET name = $1, description = $2, modified_at = $3
	WHERE id = $4`
	args := []interface{}{category.Name, category.Description, time.Now(), category.ID}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}
	return nil
}
func (m CategoryModel) Delete(id uuid.UUID) error {
	query := `UPDATE product_category
	SET is_deleted = true
	WHERE id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
func (m CategoryModel) GetAll() ([]*Category, error) {
	query := `SELECT id, name, description, created_at, modified_at, is_deleted
	FROM product_category
	WHERE is_deleted = false`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	categories := []*Category{}
	for rows.Next() {
		category := &Category{}
		err := rows.Scan(&category.ID, &category.Name, &category.Description, &category.CreateAt, &category.ModifiedAt, &category.IsDeleted)
		if err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return categories, nil
}
