package data

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type Tag struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	CreatedAt  time.Time `json:"created_at"`
	ModifiedAt time.Time `json:"modified_at"`
	IsDelete   bool      `json:"is_deleted"`
}

type TagModel struct {
	DB *sql.DB
}

func (m TagModel) Insert(tag *Tag) error {
	query := `INSERT INTO tag (name)
	VALUES ($1)`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, tag.ID, tag.Name, tag.CreatedAt, tag.ModifiedAt, tag.IsDelete)
	if err != nil {
		return err
	}
	return nil
}
func (m TagModel) GetAll() ([]*Tag, error) {
	query := `SELECT id, name, created_at, modified_at, is_deleted
	FROM tag WHERE is_deleted = false`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	tags := []*Tag{}
	for rows.Next() {
		var tag Tag
		err := rows.Scan(&tag.ID, &tag.Name, &tag.CreatedAt, &tag.ModifiedAt, &tag.IsDelete)
		if err != nil {
			return nil, err
		}
		tags = append(tags, &tag)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return tags, nil

}
func (m TagModel) Update(tag *Tag) error {
	query := `UPDATE tag
	SET name = $1, modified_at = $2
	WHERE id = $3`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, tag.Name, time.Now(), tag.ID)
	if err != nil {
		return err
	}
	return nil
}
func (m TagModel) Delete(id uuid.UUID) error {
	query := `UPDATE tag
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
func (m TagModel) Get(id uuid.UUID) (*Tag, error) {
	query := `SELECT id, name, created_at, modified_at, is_deleted
	FROM tag
	WHERE id = $1`
	var tag Tag
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, id).Scan(&tag.ID, &tag.Name, &tag.CreatedAt, &tag.ModifiedAt, &tag.IsDelete)
	if err != nil {
		return nil, err
	}
	return &tag, nil
}
func (m TagModel) GetAllTagByProductID(id uuid.UUID) ([]*Tag, error) {
	query := `SELECT t.id, t.name, t.created_at, t.modified_at, t.is_deleted
	FROM tag t
	JOIN product_tag pt ON t.id = pt.tag_id
	WHERE pt.product_id = $1 AND t.is_deleted = false`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	tags := []*Tag{}
	for rows.Next() {
		var tag Tag
		err := rows.Scan(&tag.ID, &tag.Name, &tag.CreatedAt, &tag.ModifiedAt, &tag.IsDelete)
		if err != nil {
			return nil, err
		}
		tags = append(tags, &tag)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return tags, nil
}
