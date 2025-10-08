package app

import (
	"fmt"
	"log/slog"

	v1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/controller/rest/v1"
	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/lib/s3"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/config"
	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/services"

	"github.com/evrone/go-clean-template/pkg/httpserver"
	"github.com/gin-gonic/gin"
)

type HttpServer struct {
	s       *httpserver.Server
	authS   *services.AuthService
	userS   *services.UserService
	courseS *services.CourseService
}

func Run(
	log *slog.Logger,
	cfg *config.Config,
) *HttpServer {
	// Services
	authService := services.NewAuthService(log, cfg.AuthServiceCfg)
	userService := services.NewUserService(log, cfg.UserServiceCfg)
	courseService := services.NewCourseService(log, cfg.CourseServiceCfg)

	// Clients
	clients := v1.Clients{
		Auth:   authService.Connect(),
		User:   userService.Connect(),
		Course: courseService.Connect(),
	}

	// S3
	s3Storage := s3.NewS3Storage(log, cfg.S3)

	// HTTP Server
	handler := gin.New()
	v1.NewRouter(handler, clients, log, s3Storage)
	httpServer := httpserver.New(handler, httpserver.Port(cfg.HTTP.Port))

	log.Info("api gatewate server started", slog.String("addr", cfg.HTTP.Port))

	return &HttpServer{
		s:       httpServer,
		authS:   authService,
		userS:   userService,
		courseS: courseService,
	}
}

func (s *HttpServer) Shutdown() {
	err := s.s.Shutdown()
	if err != nil {
		slog.Error(fmt.Errorf("app - Run - httpServer.Shutdown: %w", err).Error())
	}

	err = s.authS.CloseConn()
	if err != nil {
		slog.Error(fmt.Errorf("app - Run - httpServer.Shutdown - s.authS.CloseConn: %w", err).Error())
	}

	err = s.userS.CloseConn()
	if err != nil {
		slog.Error(fmt.Errorf("app - Run - httpServer.Shutdown - s.userS.CloseConn: %w", err).Error())
	}

	err = s.courseS.CloseConn()
	if err != nil {
		slog.Error(fmt.Errorf("app - Run - httpServer.Shutdown - s.courseS.CloseConn: %w", err).Error())
	}
}
