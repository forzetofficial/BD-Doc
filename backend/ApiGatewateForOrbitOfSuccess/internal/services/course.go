package services

import (
	"fmt"
	"log/slog"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/config"
	coursev1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/course"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type CourseService struct {
	log  *slog.Logger
	cfg  config.CourseServiceConfig
	conn *grpc.ClientConn
}

func NewCourseService(log *slog.Logger, cfg config.CourseServiceConfig) *CourseService {
	return &CourseService{
		log: log,
		cfg: cfg,
	}
}

func (s *CourseService) Connect() coursev1.CourseServiceClient {
	const op = "CourseService.Connect"

	log := s.log.With(
		slog.String("op", op),
	)

	log.Info("trying to connect to course service")
	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	}

	conn, err := grpc.NewClient(s.cfg.Addr, opts...)
	if err != nil {
		log.Error("failed to connect to auth service")
		panic(fmt.Errorf("%s: %w", op, err))
	}
	s.conn = conn

	client := coursev1.NewCourseServiceClient(conn)
	log.Info("successfully connected to the course service")

	return client
}

func (s *CourseService) CloseConn() error {
	if s.conn != nil {
		err := s.conn.Close()
		if err != nil {
			return err
		}
	}
	return nil
}
