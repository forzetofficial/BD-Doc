package app

import (
	"fmt"
	"log/slog"

	v1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/controller/rest/v1"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/config"
	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/services"

	"github.com/evrone/go-clean-template/pkg/httpserver"
	"github.com/gin-gonic/gin"
)

type HttpServer struct {
	s     *httpserver.Server
	authS *services.AuthService
	docsS *services.DocsService
}

func Run(
	log *slog.Logger,
	cfg *config.Config,
) *HttpServer {
	// Services
	authService := services.NewAuthService(log, cfg.AuthServiceCfg)
	docsService := services.NewDocsService(log, cfg.DocsServiceCfg)

	// Clients
	clients := v1.Clients{
		Auth: authService.Connect(),
		Docs: docsService.Connect(),
	}

	// HTTP Server
	handler := gin.New()
	v1.NewRouter(handler, clients, log)
	httpServer := httpserver.New(handler, httpserver.Port(cfg.HTTP.Port))

	log.Info("api gatewate server started", slog.String("addr", cfg.HTTP.Port))

	return &HttpServer{
		s:     httpServer,
		authS: authService,
		docsS: docsService,
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

	err = s.docsS.CloseConn()
	if err != nil {
		slog.Error(fmt.Errorf("app - Run - httpServer.Shutdown - s.docsS.CloseConn: %w", err).Error())
	}
}
