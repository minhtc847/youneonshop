package data

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"time"
	"youneon-BE/internal/validator"
)

type Product struct {
	Id          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Price       int       `json:"price"`
	Image       *string   `json:"image"`
	ImageList   *[]string `json:"image_list"`
	Description *string   `json:"description"`
	CategoryId  uuid.UUID `json:"category_id"`
	InventoryId uuid.UUID `json:"inventory_id"`
	DiscountId  uuid.UUID `json:"discount_id"`
	IsDeleted   bool      `json:"is_deleted"`
	CreatedAt   time.Time `json:"created_at"`
	ModifiedAt  time.Time `json:"modified_at"`
	Tags        []string  `json:"tags"` //Not in DB
}

type ProductModel struct {
	DB *sql.DB
}

func ValidateProduct(v *validator.Validator, product *Product) {
	v.Check(product.Name != "", "name", "must be provided")
	v.Check(len(product.Name) <= 500, "name", "must not be more than 500 bytes long")
	v.Check(product.Price != 0, "price", "must be provided")
	v.Check(product.Price >= 0, "price", "must be a positive integer")
}

func (m ProductModel) Insert(product *Product) error {
	query := `INSERT INTO product (name, price, image, image_list, description, category_id, inventory_id, discount_id)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, product.Name, product.Price, product.Image, pq.Array(product.ImageList), product.Description, product.CategoryId, product.InventoryId, product.DiscountId)
	if err != nil {
		return err
	}
	return nil
}
func (m ProductModel) GetAll(filters Filters, category string, tags []string, name string, priceFrom int, priceTo int) ([]*Product, Metadata, error) {
	query := fmt.Sprintf(`
SELECT count(*) OVER(), 
       p.id, 
       p.name, 
       p.price, 
       p.image, 
       p.image_list, 
       p.description, 
       p.category_id, 
       p.inventory_id, 
       p.discount_id, 
       p.is_deleted, 
       p.created_at, 
       p.modified_at,
       array_agg(t.name) AS tags
FROM product p
LEFT JOIN product_category c ON p.category_id = c.id
LEFT JOIN tag_product pt ON p.id = pt.product_id
LEFT JOIN tag t ON pt.tag_id = t.id
WHERE (c.name = $1 OR $1 = '')
  AND (to_tsvector('simple', p.name) @@ plainto_tsquery('simple', $2) OR $2 = '')
  AND (p.price >= $3 OR $3 = 0)
  AND (p.price <= $4 OR $4 = 0)
  AND ($5 = '{}'::text[] OR t.name = ANY($5))
  AND p.is_deleted = false
GROUP BY p.id, p.name, p.price, p.image, p.image_list, p.description, 
         p.category_id, p.inventory_id, p.discount_id, 
         p.is_deleted, p.created_at, p.modified_at
ORDER BY %s %s, p.id ASC
LIMIT $6 OFFSET $7
`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []any{
		category,         // Category name
		name,             // Full-text search input
		priceFrom,        // Minimum price
		priceTo,          // Maximum price
		pq.Array(tags),   // Array of tag names
		filters.limit(),  // Limit for pagination
		filters.offset(), // Offset for pagination
	}

	rows, err := m.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	products := []*Product{}
	for rows.Next() {
		var product Product
		err := rows.Scan(
			&totalRecords,
			&product.Id,
			&product.Name,
			&product.Price,
			&product.Image,
			&product.ImageList,
			&product.Description,
			&product.CategoryId,
			&product.InventoryId,
			&product.DiscountId,
			&product.IsDeleted,
			&product.CreatedAt,
			&product.ModifiedAt,
			pq.Array(&product.Tags),
		)
		if err != nil {
			return nil, Metadata{}, err
		}
		products = append(products, &product)
	}
	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)
	return products, metadata, nil
}

func (m ProductModel) Get(id uuid.UUID) (*Product, error) {
	query := `SELECT id, name, price, image, image_list, description, category_id, inventory_id, discount_id, is_deleted, created_at, modified_at
	FROM product
	WHERE id = $1`
	var product Product
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.DB.QueryRowContext(ctx, query, id).Scan(&product.Id, &product.Name, &product.Price, &product.Image, &product.ImageList, &product.Description, &product.CategoryId, &product.InventoryId, &product.DiscountId, &product.IsDeleted, &product.CreatedAt, &product.ModifiedAt)
	if err != nil {
		return nil, err
	}
	return &product, nil
}
func (m ProductModel) Update(product *Product) error {
	query := `UPDATE product
	SET name = $1, price = $2, image = $3, image_list = $4, description = $5, category_id = $6, inventory_id = $7, discount_id = $8, modified_at = $9
	WHERE id = $10`
	args := []interface{}{product.Name, product.Price, product.Image, pq.Array(product.ImageList), product.Description, product.CategoryId, product.InventoryId, product.DiscountId, time.Now(), product.Id}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}
	return nil
}
func (m ProductModel) Delete(id uuid.UUID) error {
	query := `UPDATE product
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
