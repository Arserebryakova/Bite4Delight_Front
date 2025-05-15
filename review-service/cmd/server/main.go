package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"pkg/config"
	"pkg/internal/handler"
	"pkg/internal/repository"
	"pkg/internal/service"
	"pkg/pkg/db"
)

func main() {
	config.Load()
	db.Connect()
	defer db.Conn.Close()

	reviewRepo := repository.NewReviewRepository(db.Conn)
	reviewSvc := service.NewReviewService(reviewRepo)

	router := gin.Default()
	handler.NewReviewHandler(router, reviewSvc)
	handler.RegisterLocationsRoute(router)

	log.Println("Review Service listening on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
