package apiHandler

import "github.com/gofiber/fiber/v2"

func Foo() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{
			"success": true,
			"foo":     "hi",
		})
	}
}

func Bar() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{
			"success": true,
			"bar":     "hi",
		})
	}
}
