package services

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strings"
)

type EmailService struct {
	Host     string
	Port     string
	User     string
	Password string
	Sender   string
}

func NewEmailService() *EmailService {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		host = "smtp.ethereal.email"
	}
	port := os.Getenv("SMTP_PORT")
	if port == "" {
		port = "587"
	}
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	sender := os.Getenv("SMTP_SENDER")
	if sender == "" {
		sender = user
	}

	return &EmailService{
		Host:     host,
		Port:     port,
		User:     user,
		Password: pass,
		Sender:   sender,
	}
}

func (s *EmailService) SendRegistrationNotification(toEmail, userName string) error {
	addr := fmt.Sprintf("%s:%s", s.Host, s.Port)
	auth := smtp.PlainAuth("", s.User, s.Password, s.Host)

	subject := "Pendaftaran Berhasil"
	body := fmt.Sprintf("Halo %s,\n\nPendaftaran akun Anda berhasil. Anda telah terdaftar dalam sistem.\n\nTerima kasih.", userName)
	headers := make(map[string]string)
	headers["From"] = s.Sender
	headers["To"] = toEmail
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/plain; charset=\"UTF-8\""

	var msg strings.Builder
	for k, v := range headers {
		msg.WriteString(fmt.Sprintf("%s: %s\r\n", k, v))
	}
	msg.WriteString("\r\n")
	msg.WriteString(body)

	to := []string{toEmail}
	err := smtp.SendMail(addr, auth, s.User, to, []byte(msg.String()))
	if err != nil {
		log.Printf("[EmailService] Gagal mengirim email ke %s: %v\n", toEmail, err)
		return err
	}

	log.Printf("[EmailService] Email notifikasi berhasil dikirim ke %s\n", toEmail)
	return nil
}
