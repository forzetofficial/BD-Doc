// Package v1 implements routing paths. Each services in own file.
package v1

import (
	"log/slog"
	"net/http"

	_ "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/docs"

	authv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/auth"
	docsv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/docs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Clients struct {
	Auth authv1.AuthClient
	Docs docsv1.DocsClient
}

// Swagger spec:
// @title       API Gatewate
// @description API Gatewate for service
// @version     1.0
// @schemes 	https
// @host        77.51.223.54:5173
// @BasePath    /api/v1
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func NewRouter(handler *gin.Engine, c Clients, log *slog.Logger) {
	// Options
	handler.Use(gin.Logger())
	handler.Use(gin.Recovery())

	// Set cors
	corsConf := cors.DefaultConfig()
	corsConf.AllowOrigins = []string{"http://localhost:5173", "http://77.51.223.54:5173"}
	corsConf.AllowHeaders = []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"}
	corsConf.AllowCredentials = true
	handler.Use(cors.New(corsConf))

	// Swagger
	swaggerHandler := ginSwagger.DisablingWrapHandler(swaggerFiles.Handler, "DISABLE_SWAGGER_HTTP_HANDLER")
	handler.GET("/swagger/*any", swaggerHandler)

	// K8s probe
	handler.GET("/healthz", func(c *gin.Context) { c.Status(http.StatusOK) })

	// Prometheus metrics
	handler.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Routers
	g := handler.Group("/api/v1")
	{
		NewAuthRoutes(log, g, c.Auth)
	}

	ga := handler.Group("/api/v1")
	{
		ga.Use(authMiddleware(log, c.Auth))
		NewDocsRoutes(log, ga, c.Docs)
	}
}
