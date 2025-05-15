package db

import (
	"log"
	"pkg/config"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var Conn *sqlx.DB

func Connect() {
	// Убедимся, что конфиг загружен
	config.Load()

	dsn := config.Cfg.PostgresURL
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalf("Cannot connect to Postgres: %v", err)
	}

	// Параметры пула соединений (можно настроить по нагрузке)
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(10)
	db.SetConnMaxIdleTime(5 * time.Minute)
	db.SetConnMaxLifetime(1 * time.Hour)

	Conn = db
}
