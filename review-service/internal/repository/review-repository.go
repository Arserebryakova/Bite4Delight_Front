package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"pkg/internal/model"
)

type ReviewRepository interface {
	FetchAll() ([]model.Review, error)
	FetchByID(id int) (model.Review, error)
	Create(r model.InputReview) (int, error)
	UpdateStatus(id int, newStatus string) error
	FetchByPlace(place string) ([]model.Review, error)
	FetchApprovedByPlace(place string) ([]model.Review, error)
	FetchPlaces() ([]string, error)
	FetchByStatus(status string) ([]model.Review, error)
}

type reviewRepo struct {
	db *sqlx.DB
}

func NewReviewRepository(db *sqlx.DB) *reviewRepo {
	return &reviewRepo{db: db}
}

func (r *reviewRepo) FetchAll() ([]model.Review, error) {
	var reviews []model.Review
	query := `SELECT * FROM reviews ORDER BY created_at DESC`
	if err := r.db.Select(&reviews, query); err != nil {
		return nil, fmt.Errorf("FetchAll: %w", err)
	}
	return reviews, nil
}

func (r *reviewRepo) FetchByID(id int) (model.Review, error) {
	var rev model.Review
	query := `SELECT * FROM reviews WHERE id = $1`
	if err := r.db.Get(&rev, query, id); err != nil {
		return model.Review{}, fmt.Errorf("FetchByID: %w", err)
	}
	return rev, nil
}

func (r *reviewRepo) Create(input model.InputReview) (int, error) {
	var id int
	query := `
        INSERT INTO reviews (place, title, content, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `
	err := r.db.QueryRow(query, input.Place, input.Title, input.Content, input.Rating).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("Create: %w", err)
	}
	return id, nil
}

func (r *reviewRepo) UpdateStatus(id int, newStatus string) error {
	query := `UPDATE reviews SET status = $1 WHERE id = $2`
	_, err := r.db.Exec(query, newStatus, id)
	if err != nil {
		return fmt.Errorf("UpdateStatus: %w", err)
	}
	return nil
}

func (r *reviewRepo) FetchByPlace(place string) ([]model.Review, error) {
	var reviews []model.Review
	query := `SELECT * FROM reviews WHERE place = $1 ORDER BY created_at DESC`
	if err := r.db.Select(&reviews, query, place); err != nil {
		return nil, fmt.Errorf("FetchByPlace: %w", err)
	}
	return reviews, nil
}

func (r *reviewRepo) FetchApprovedByPlace(place string) ([]model.Review, error) {
	var reviews []model.Review
	query := `SELECT * FROM reviews WHERE place = $1 AND status = 'Принят' ORDER BY created_at DESC`
	if err := r.db.Select(&reviews, query, place); err != nil {
		return nil, fmt.Errorf("FetchApprovedByPlace: %w", err)
	}
	return reviews, nil
}

func (r *reviewRepo) FetchByStatus(status string) ([]model.Review, error) {
	var reviews []model.Review
	query := `SELECT id, place, title, content, rating, created_at, status  FROM reviews WHERE status = $1 ORDER BY created_at DESC`
	if err := r.db.Select(&reviews, query, status); err != nil {
		return nil, fmt.Errorf("FetchByStatus: %w", err)
	}
	return reviews, nil
}

func (r *reviewRepo) FetchPlaces() ([]string, error) {
	var places []string
	query := `SELECT DISTINCT place FROM reviews ORDER BY place`
	if err := r.db.Select(&places, query); err != nil {
		return nil, fmt.Errorf("FetchPlaces: %w", err)
	}
	return places, nil
}
