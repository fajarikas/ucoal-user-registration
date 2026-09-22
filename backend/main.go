package main

import (
	"log"
	"os"

	"backend/config"
	"backend/handlers"
	"backend/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("[INFO] File .env tidak ditemukan, menggunakan environment system")
	}

	config.InitDB()

	emailService := services.NewEmailService()
	userHandler := handlers.NewUserHandler(emailService)

	app := fiber.New(fiber.Config{
		AppName: "Ucoal User Registration API",
	})

	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path} (${latency})\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, OPTIONS",
	}))

	api := app.Group("/api")
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "OK",
			"service": "User Registration API (Golang Fiber)",
		})
	})
	api.Post("/register", userHandler.Register)
	api.Get("/users", userHandler.GetUsers)
	api.Get("/smtp-info", userHandler.GetSMTPInfo)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server backend berjalan di http://localhost:%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
