package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"pkg/internal/model"
	"pkg/internal/service"
	"strconv"
)

type ReviewHandler struct {
	Service service.ReviewService
}

func NewReviewHandler(r *gin.Engine, svc service.ReviewService) {
	handler := &ReviewHandler{Service: svc}

	api := r.Group("/api/reviews")
	{
		api.GET("", handler.GetAllReviews)
		api.POST("", handler.CreateReview)
		api.GET("/:id", handler.GetReviewByID)
		api.PATCH("/:id", handler.UpdateReviewStatus)
		api.GET("/place/:place", handler.GetReviewsByPlace)
		api.GET("/approved/:place", handler.GetApprovedByPlace)
	}
	r.GET("/api/places", handler.GetPlaces)
	r.POST("/api/summarize", handler.Summarize)
}

func (h *ReviewHandler) GetPlaces(c *gin.Context) {
	places, err := h.Service.GetPlaces()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, places)
}

func (h *ReviewHandler) GetAllReviews(c *gin.Context) {
	// 1) read query param
	status := c.Query("status")

	// 2) call appropriate repo method
	var (
		reviews []model.Review
		err     error
	)
	if status != "" {
		reviews, err = h.Service.GetByStatus(status)
	} else {
		reviews, err = h.Service.GetAllReviews()
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 3) return
	c.JSON(http.StatusOK, reviews)
}

func (h *ReviewHandler) CreateReview(c *gin.Context) {
	var input model.InputReview
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id, err := h.Service.CreateReview(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *ReviewHandler) GetReviewByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	review, err := h.Service.GetReviewByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, review)
}

func (h *ReviewHandler) UpdateReviewStatus(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var payload struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Service.ModerateReview(id, payload.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *ReviewHandler) GetReviewsByPlace(c *gin.Context) {
	place := c.Param("place")
	reviews, err := h.Service.GetReviewsByPlace(place)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}

func (h *ReviewHandler) GetApprovedByPlace(c *gin.Context) {
	place := c.Param("place")
	reviews, err := h.Service.GetApprovedByPlace(place)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}
