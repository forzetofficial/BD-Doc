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
	GetFiltered(ctx context.Context, doc *entities.Doc) ([]*entities.Doc, error)
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

func (s *serverAPI) GetFiltered(
	ctx context.Context,
	in *docv1.GetFilteredRequest,
) (*docv1.GetResponse, error) {
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
	docs, err := s.docs.GetFiltered(ctx, data)
	if err != nil {
		if errors.Is(err, services.ErrDocNotFound) {
			return nil, status.Error(codes.AlreadyExists, "documents not found")
		}

		return nil, status.Error(codes.Internal, "failed to get")
	}

	resp := make([]*docv1.Doc, 0, len(docs))
	for _, doc := range docs {
		resp_doc := &docv1.Doc{
			Id:         int64(doc.ID),
			Type:       doc.Type,
			Group:      doc.Group,
			Fio:        doc.FIO,
			Theme:      doc.Theme,
			Director:   doc.Director,
			Year:       int32(doc.Year),
			Order:      doc.Order,
			Reviewer:   doc.Reviewer,
			Discipline: doc.Discipline,
		}
		resp = append(resp, resp_doc)
	}

	return &docv1.GetResponse{
		Docs: resp,
	}, nil
}
