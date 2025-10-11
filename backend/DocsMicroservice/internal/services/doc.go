package services

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/Homyakadze14/DocsMicroservice/internal/entities"
)

var (
	ErrDocAlreadyExists = errors.New("document with this theme already exists")
)

type DocRepo interface {
	Create(ctx context.Context, doc *entities.Doc) (id int, err error)
}

type DocService struct {
	log     *slog.Logger
	docRepo DocRepo
}

func NewDocService(
	log *slog.Logger,
	docRepo DocRepo,
) *DocService {
	return &DocService{
		log:     log,
		docRepo: docRepo,
	}
}

func (s *DocService) Create(ctx context.Context, doc *entities.Doc) (id int, err error) {
	const op = "Auth.Create"

	log := s.log.With(
		slog.String("op", op),
		slog.String("acc", doc.String()),
	)

	id, err = s.docRepo.Create(ctx, doc)
	if err != nil {
		log.Error(err.Error())
		return -1, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}
