package database

import (
	"context"
	"github.com/go-pg/pg/v10"
	"log"
	"os"
)

func Connect() {
	url := os.Getenv("DB_URL")
	options, err := pg.ParseURL(url)
	if err != nil {
		log.Fatal("• Error when connecting to the db.", err)
	}

	db := pg.Connect(options)
	defer db.Close()

	ctx := context.Background()
	if err := db.Ping(ctx); err != nil {
		panic(err)
	} else {
		println("• Database connected !")
	}
}
