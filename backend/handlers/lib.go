package apiHandler

import (
	"github.com/gofiber/fiber/v2"
	"io"
	"log"
	"net/http"
)

type Track struct {
	TrackId string `json:"trackId" xml:"trackId" form:"trackId"`
}

func GetTrack() fiber.Handler {
	return func(c *fiber.Ctx) error {
		body := new(Track)
		if err := c.BodyParser(body); err != nil {
			return err
		}

		res, err := http.Get("https://api.deezer.com/track/" + body.TrackId)
		if err != nil {
			// handle error
		}

		req, err := io.ReadAll(res.Body)
		if err != nil {
			log.Fatalln(err)
		}

		return c.SendString(string(req))
	}
}
