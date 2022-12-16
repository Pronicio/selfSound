package main

import (
	apiRoutes "back/routes"
	crypt "back/utils"
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

	port := os.Getenv("PORT")
	err = app.Listen(":" + port)
	if err != nil {
		log.Fatal("• Error when launching the app.", err)
	}
}

func test() {
	// Crypt code :
	crypted := crypt.EncryptData("test")
	println(crypted)

	matched := crypt.VerifyData("test", crypted)
	println(matched)
}
