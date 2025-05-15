package model

import (
	"time"
)

// Review описывает структуру таблицы reviews в базе
type Review struct {
	ID        int       `db:"id" json:"id"`
	Place     string    `db:"place" json:"place"`
	Title     string    `db:"title" json:"title"`
	Content   string    `db:"content" json:"content"`
	Rating    int       `db:"rating" json:"rating"`
	Status    string    `db:"status" json:"status"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

// InputReview используется для приёма новых отзывов от клиента
type InputReview struct {
	Place   string `json:"place" binding:"required"`
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
	Rating  int    `json:"rating" binding:"required,gte=0,lte=10"`
}
