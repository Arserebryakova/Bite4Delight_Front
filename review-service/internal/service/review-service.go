package service

import (
	"pkg/internal/model"
	"pkg/internal/repository"
)

type ReviewService interface {
	GetAllReviews() ([]model.Review, error)
	GetReviewByID(id int) (model.Review, error)
	CreateReview(input model.InputReview) (int, error)
	ModerateReview(id int, newStatus string) error
	GetReviewsByPlace(place string) ([]model.Review, error)
	GetApprovedByPlace(place string) ([]model.Review, error)
	GetPlaces() ([]string, error)
	GetByStatus(status string) ([]model.Review, error)
}

type reviewService struct {
	repo repository.ReviewRepository
}

func (s *reviewService) GetPlaces() ([]string, error) {
	return s.repo.FetchPlaces()
}

func NewReviewService(repo repository.ReviewRepository) ReviewService {
	return &reviewService{repo: repo}
}

func (s *reviewService) GetAllReviews() ([]model.Review, error) {
	return s.repo.FetchAll()
}

func (s *reviewService) GetReviewByID(id int) (model.Review, error) {
	return s.repo.FetchByID(id)
}

func (s *reviewService) CreateReview(input model.InputReview) (int, error) {
	return s.repo.Create(input)
}

func (s *reviewService) ModerateReview(id int, newStatus string) error {
	return s.repo.UpdateStatus(id, newStatus)
}

func (s *reviewService) GetReviewsByPlace(place string) ([]model.Review, error) {
	return s.repo.FetchByPlace(place)
}

func (s *reviewService) GetApprovedByPlace(place string) ([]model.Review, error) {
	return s.repo.FetchApprovedByPlace(place)
}

func (s *reviewService) GetByStatus(status string) ([]model.Review, error) {
	return s.repo.FetchByStatus(status)
}
