package apiRoutes

import (
	apiHandler "back/handlers"
	"github.com/gofiber/fiber/v2"
)

func ApiRouter(app fiber.Router) {
	app.Get("/", apiHandler.Home())
}

func AuthRouter(app fiber.Router) {
	app.Post("/login", apiHandler.Login())
	app.Post("/register", apiHandler.Home())
}

func UserRouter(app fiber.Router) {
	app.Get("/@", apiHandler.UserInfo())
	app.Post("/library", apiHandler.Home())
}

func LibRouter(app fiber.Router) {
	app.Post("/search", apiHandler.Home())
	app.Post("/track", apiHandler.GetTrack())
	app.Post("/album", apiHandler.Home())
	app.Post("/artist", apiHandler.Home())
	app.Post("/playlist", apiHandler.Home())
	app.Post("/profile", apiHandler.Home())
}

func YoutubeRouter(app fiber.Router) {
	app.Post("/search", apiHandler.Home())
	app.Post("/video", apiHandler.Home())
	app.Post("/profile", apiHandler.Home())
}
