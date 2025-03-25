package data

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"regexp"
	"time"
)

type Shortener struct {
	Id       uuid.UUID `json:"id"`
	ShortURL string    `json:"short_url"`
	LongURL  string    `json:"long_url"`
}

type ShortenerModel struct {
	db *sql.DB
}

func ValidateURL(url string) bool {
	// Define a regular expression pattern for a valid URL
	var urlPattern = regexp.MustCompile(`^https?://[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:[0-9]+)?(/.*)?$`)

	// Check if the URL matches the pattern
	return urlPattern.MatchString(url)
}

func (m ShortenerModel) CreateShortener(longURL string, shortURL string) (Shortener, error) {
	query := `INSERT INTO shortener (long_url, short_url) VALUES ($1, $2) RETURNING id`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	var id uuid.UUID
	err := m.db.QueryRowContext(ctx, query, longURL, shortURL).Scan(&id)
	if err != nil {
		return Shortener{}, err
	}
	query = `SELECT id, short_url, long_url FROM shortener WHERE id = $1`
	var shortener Shortener
	err = m.db.QueryRowContext(ctx, query, id).Scan(&shortener.Id, &shortener.ShortURL, &shortener.LongURL)
	if err != nil {
		return Shortener{}, err
	}
	return shortener, nil
}

func (m ShortenerModel) GetShortener(shortURL string) (*Shortener, error) {
	query := `SELECT id, short_url, long_url FROM shortener WHERE short_url = $1`
	var shortener Shortener
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err := m.db.QueryRowContext(ctx, query, shortURL).Scan(&shortener.Id, &shortener.ShortURL, &shortener.LongURL)
	if err != nil {
		return nil, err
	}
	return &shortener, nil
}
func (m ShortenerModel) IsLongURLExists(longURL string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM shortener WHERE long_url = $1)`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	var exists bool
	err := m.db.QueryRowContext(ctx, query, longURL).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}
