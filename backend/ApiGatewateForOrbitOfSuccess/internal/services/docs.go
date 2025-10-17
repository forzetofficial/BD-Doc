package services

import (
	"fmt"
	"log/slog"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/config"
	docsv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/docs"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type DocsService struct {
	log  *slog.Logger
	cfg  config.DocsServiceConfig
	conn *grpc.ClientConn
}

func NewDocsService(log *slog.Logger, cfg config.DocsServiceConfig) *DocsService {
	return &DocsService{
		log: log,
		cfg: cfg,
	}
}

func (s *DocsService) Connect() docsv1.DocsClient {
	const op = "DocsService.Connect"

	log := s.log.With(
		slog.String("op", op),
	)

	log.Info("trying to connect to auth service")
	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	}

	conn, err := grpc.NewClient(s.cfg.Addr, opts...)
	if err != nil {
		log.Error("failed to connect to auth service")
		panic(fmt.Errorf("%s: %w", op, err))
	}
	s.conn = conn

	client := docsv1.NewDocsClient(conn)
	log.Info("successfully connected to the auth service")

	return client
}

func (s *DocsService) CloseConn() error {
	if s.conn != nil {
		err := s.conn.Close()
		if err != nil {
			return err
		}
	}
	return nil
}
