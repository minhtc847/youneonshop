package data

import (
	"database/sql"
	"errors"
	"github.com/google/uuid"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
	ErrDuplicateEmail = errors.New("duplicate email")
)

type Models struct {
	Users interface {
		Insert(user *User) error
		GetByEmail(email string) (*User, error)
		Update(profile *User) error
		Get(id uuid.UUID) (*User, error)
	}
	Products interface {
		Insert(product *Product) error
		Get(id uuid.UUID) (*Product, error)
		Update(product *Product) error
		Delete(id uuid.UUID) error
		GetAll(filters Filters, category string, tags []string, name string, priceFrom int, priceTo int) ([]*Product, Metadata, error)
	}
	Categories interface {
		Insert(category *Category) error
		Get(id uuid.UUID) (*Category, error)
		Update(category *Category) error
		Delete(id uuid.UUID) error
		GetAll() ([]*Category, error)
	}
	Tags interface {
		Insert(tag *Tag) error
		Get(id uuid.UUID) (*Tag, error)
		Update(tag *Tag) error
		Delete(id uuid.UUID) error
		GetAll() ([]*Tag, error)
		GetAllTagByProductID(id uuid.UUID) ([]*Tag, error)
	}
	CartItems interface {
		Insert(cartItem *CartItem) error
		Delete(userId uuid.UUID, productId uuid.UUID) error
		GetAllByUserID(id uuid.UUID) ([]*CartItem, error)
		Update(item *CartItem) error
		GetQuantity(userId uuid.UUID, productId uuid.UUID) (int, error)
	}
	Address interface {
		Insert(address *Address) error
		GetAllByUserID(id uuid.UUID) ([]*Address, error)
		Get(id uuid.UUID) (*Address, error)
		Update(address *Address) error
		Delete(id uuid.UUID) error
	}
	OrderDetail interface {
		Insert(orderDetail *OrderDetail) (*uuid.UUID, error)
		GetAllByUserID(id uuid.UUID) ([]*OrderDetail, error)
		Update(orderDetail *OrderDetail) error
		Delete(id uuid.UUID) error
		GetById(id uuid.UUID) (*OrderDetail, error)
	}
	OrderItem interface {
		Insert(orderItem *OrderItem) (*uuid.UUID, error)
		GetAllByOrderID(id uuid.UUID) ([]*OrderItem, error)
	}
	Shortener interface {
		CreateShortener(longURL string, shortURL string) (Shortener, error)
		GetShortener(shortURL string) (*Shortener, error)
		IsLongURLExists(longURL string) (bool, error)
	}
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:       UserModel{DB: db},
		Products:    ProductModel{DB: db},
		Categories:  CategoryModel{DB: db},
		Tags:        TagModel{DB: db},
		CartItems:   CartItemModel{DB: db},
		Address:     AddressModel{DB: db},
		OrderDetail: OrderDetailModel{DB: db},
		OrderItem:   OrderItemModel{DB: db},
		Shortener:   ShortenerModel{db: db},
	}
}
