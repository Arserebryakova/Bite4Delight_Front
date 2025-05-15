package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	PostgresURL string `mapstructure:"POSTGRES_URL"`
}

var Cfg Config

func Load() {
	viper.SetDefault("POSTGRES_URL", "postgres://postgres:postgres@db:5432/postgres?sslmode=disable")
	viper.AutomaticEnv()

	if err := viper.Unmarshal(&Cfg); err != nil {
		log.Fatalf("Error unmarshalling config: %v", err)
	}
}
