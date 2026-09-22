package handlers

import (
	"net/mail"
	"strings"

	"backend/config"
	"backend/models"
	"backend/services"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	emailService *services.EmailService
}

func NewUserHandler(emailService *services.EmailService) *UserHandler {
	return &UserHandler{
		emailService: emailService,
	}
}

func (h *UserHandler) Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Format request tidak valid",
		})
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))

	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Nama lengkap wajib diisi",
		})
	}

	if req.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Alamat email wajib diisi",
		})
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Format alamat email tidak valid",
		})
	}

	if len(req.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password minimal terdiri dari 6 karakter",
		})
	}

	// Check if user with same email exists
	var existing models.User
	if err := config.DB.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email sudah terdaftar. Silakan gunakan email lain.",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal memproses password",
		})
	}

	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal menyimpan user ke database",
		})
	}

	// Send notification email asynchronously or synchronously
	emailErr := h.emailService.SendRegistrationNotification(user.Email, user.Name)
	emailStatus := "Email notifikasi berhasil dikirim via Ethereal SMTP"
	if emailErr != nil {
		emailStatus = "Pendaftaran berhasil, tetapi pengiriman email notifikasi gagal: " + emailErr.Error()
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":      "User berhasil didaftarkan",
		"email_status": emailStatus,
		"user": fiber.Map{
			"id":         user.ID,
			"name":       user.Name,
			"email":      user.Email,
			"created_at": user.CreatedAt,
		},
	})
}

func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := config.DB.Order("created_at desc").Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal mengambil data user",
		})
	}

	return c.JSON(fiber.Map{
		"users": users,
		"total": len(users),
	})
}

func (h *UserHandler) GetSMTPInfo(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"host":        h.emailService.Host,
		"port":        h.emailService.Port,
		"sender":      h.emailService.Sender,
		"account":     h.emailService.User,
		"web_mailbox": "https://ethereal.email/messages",
	})
}
