package apiHandler

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
)

func GetTrack() fiber.Handler {
	return func(c *fiber.Ctx) error {

		res, err := http.Get("http://example.com/")
		if err != nil {
			// handle error
		}

		println(res)

		return c.JSON(&fiber.Map{
			"success": true,
			"hello":   "world",
		})
	}
}
