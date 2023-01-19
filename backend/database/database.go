package database

import (
	"context"
	"fmt"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
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

	err = createSchema(db)
	if err != nil {
		log.Fatal("• Error when creating schemas.", err)
	}

	ctx := context.Background()
	if err := db.Ping(ctx); err != nil {
		panic(err)
	} else {
		println("• Database connected !")
	}

	user1 := &User{
		Name:  "admin",
		Email: "admin@admin",
	}
	_, err = db.Model(user1).Insert()
	if err != nil {
		panic(err)
	}

	_, err = db.Model(&User{
		Name:  "root",
		Email: "root@root",
	}).Insert()
	if err != nil {
		panic(err)
	}

	story1 := &Story{
		Title:    "Cool story",
		AuthorId: user1.Id,
	}
	_, err = db.Model(story1).Insert()
	if err != nil {
		panic(err)
	}

	// Select user by primary key.
	user := &User{Id: user1.Id}
	err = db.Model(user).WherePK().Select()
	if err != nil {
		panic(err)
	}

	// Select all users.
	var users []User
	err = db.Model(&users).Select()
	if err != nil {
		panic(err)
	}

	// Select story and associated author in one query.
	story := new(Story)
	err = db.Model(story).
		Relation("Author").
		Where("story.id = ?", story1.Id).
		Select()
	if err != nil {
		panic(err)
	}

	fmt.Println(user)
	fmt.Println(users)
	fmt.Println(story)
}

type User struct {
	Id    int64
	Name  string
	Email string
}

type Story struct {
	Id       int64
	Title    string
	AuthorId int64
	Author   *User `pg:"rel:has-one"`
}

func createSchema(db *pg.DB) error {
	models := []interface{}{
		(*User)(nil),
		(*Story)(nil),
	}

	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			Temp: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
