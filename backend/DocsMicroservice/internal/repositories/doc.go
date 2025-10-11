package repositories

import (
	"context"
	"fmt"
	"strings"

	"github.com/Homyakadze14/DocsMicroservice/internal/entities"
	"github.com/Homyakadze14/DocsMicroservice/internal/services"
	"github.com/Homyakadze14/DocsMicroservice/pkg/postgres"
)

type DocRepository struct {
	*postgres.Postgres
}

func NewDocRepository(pg *postgres.Postgres) *DocRepository {
	return &DocRepository{pg}
}

func (r *DocRepository) Create(ctx context.Context, doc *entities.Doc) (id int, err error) {
	const op = "repositories.DocRepository.Create"

	row := r.Pool.QueryRow(
		ctx,
		`INSERT INTO docs(type, group_name, fio, theme, director, year, order_name, reviewer, discipline)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
		doc.Type, doc.Group, doc.FIO, doc.Theme, doc.Director, doc.Year, doc.Order, doc.Reviewer, doc.Discipline)

	err = row.Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "SQLSTATE 23505") {
			return -1, services.ErrDocAlreadyExists
		}
		return -1, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}
