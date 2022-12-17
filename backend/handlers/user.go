package apiHandler

import (
	"github.com/gofiber/fiber/v2"
)

func UserInfo() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{
			"success": true,
			"tt":      "world",
		})
	}
}
