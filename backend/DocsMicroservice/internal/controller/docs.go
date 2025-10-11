package controller

import (
	"context"
	"errors"

	"github.com/Homyakadze14/DocsMicroservice/internal/entities"
	"github.com/Homyakadze14/DocsMicroservice/internal/services"
	docv1 "github.com/Homyakadze14/DocsMicroservice/proto/gen/docs"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type serverAPI struct {
	docv1.UnimplementedDocsServer
	docs Docs
}

type Docs interface {
	Create(ctx context.Context, doc *entities.Doc) (int, error)
}

func Register(gRPCServer *grpc.Server, docs Docs) {
	docv1.RegisterDocsServer(gRPCServer, &serverAPI{docs: docs})
}

func (s *serverAPI) Create(
	ctx context.Context,
	in *docv1.CreateRequest,
) (*docv1.SuccessResponse, error) {
	if in.Type == "" || in.Group == "" || in.Fio == "" || in.Theme == "" || in.Director == "" ||
		in.Year < 1000 || in.Year > 9999 || in.Order == "" {
		return nil, status.Error(codes.InvalidArgument, "wrong data in request")
	}

	data := &entities.Doc{
		Type:       in.Type,
		Group:      in.Group,
		FIO:        in.Fio,
		Theme:      in.Theme,
		Director:   in.Director,
		Year:       int(in.Year),
		Order:      in.Order,
		Reviewer:   in.Reviewer,
		Discipline: in.Discipline,
	}
	_, err := s.docs.Create(ctx, data)
	if err != nil {
		if errors.Is(err, services.ErrDocAlreadyExists) {
			return nil, status.Error(codes.AlreadyExists, "document with theme already exists")
		}

		return nil, status.Error(codes.Internal, "failed to create")
	}

	return &docv1.SuccessResponse{
		Success: true,
	}, nil
}
