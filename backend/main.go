package main

import (
	"back/database"
	apiRoutes "back/routes"
	utils "back/utils"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/joho/godotenv"
	"log"
	"os"
	"time"
)

func main() {
	fmt.Println("Starting the application...")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("• Error loading .env file")
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*, http://127.0.0.1:3000, https://pronicio.dev",
	}))

	app.Use(limiter.New(limiter.Config{
		Expiration: 10 * time.Second,
		Max:        8,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	api := app.Group("/api")
	apiRoutes.ApiRouter(api)

	apiAuth := api.Group("/auth")
	apiRoutes.AuthRouter(apiAuth)

	/*
		secret := os.Getenv("JWT_SECRET")
		app.Use(jwtware.New(jwtware.Config{
			SigningKey: []byte(secret),
		}))
	*/

	apiUser := api.Group("/user")
	apiRoutes.UserRouter(apiUser)

	apiLib := api.Group("/lib")
	apiRoutes.LibRouter(apiLib)

	database.Connect()

	port := os.Getenv("PORT")
	err = app.Listen(":" + port)
	if err != nil {
		log.Fatal("• Error when launching the app.", err)
	}
}

func test() {
	// Crypt code :
	crypted := utils.EncryptData("test")
	println(crypted)

	matched := utils.VerifyData("test", crypted)
	println(matched)
}
