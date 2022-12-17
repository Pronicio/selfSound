package apiHandler

import "github.com/gofiber/fiber/v2"

func Home() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{
			"success": true,
			"hello":   "world",
		})
	}
}
