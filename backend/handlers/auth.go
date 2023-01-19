package apiHandler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"os"
	"time"
)

func Login() fiber.Handler {
	return func(c *fiber.Ctx) error {
		username := c.FormValue("username")
		password := c.FormValue("password")

		//TODO: Database integration.
		if username != "john" || password != "doe" {
			return c.SendStatus(fiber.StatusUnauthorized)
		}

		claims := jwt.MapClaims{
			"name":  "John Doe",
			"admin": true,
			"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(),
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		secret := os.Getenv("JWT_SECRET")
		t, err := token.SignedString([]byte(secret))
		if err != nil {
			return c.SendStatus(fiber.StatusInternalServerError)
		}

		return c.JSON(fiber.Map{"token": t})
	}
}
