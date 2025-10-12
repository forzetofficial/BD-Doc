package repositories

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/Homyakadze14/DocsMicroservice/internal/entities"
	"github.com/Homyakadze14/DocsMicroservice/internal/services"
	"github.com/Homyakadze14/DocsMicroservice/pkg/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
)

type DocRepository struct {
	*postgres.Postgres
}

func NewDocRepository(pg *postgres.Postgres) *DocRepository {
	return &DocRepository{pg}
}

func getDoc(op string, row pgx.Row) (*entities.Doc, error) {
	doc := &entities.Doc{}
	err := row.Scan(&doc.ID, &doc.Type, &doc.Group, &doc.FIO, &doc.Theme,
		&doc.Director, &doc.Year, &doc.Order, &doc.Reviewer, &doc.Discipline)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, services.ErrDocNotFound
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return doc, nil
}

func (r *DocRepository) Create(ctx context.Context, doc *entities.Doc) (id int, err error) {
	const op = "repositories.DocRepository.Create"

	row := r.Pool.QueryRow(
		ctx,
		`INSERT INTO docs(type, group_name, fio, theme, director, year, order_name, reviewer, discipline)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
		strings.ToLower(doc.Type), strings.ToLower(doc.Group), strings.ToLower(doc.FIO), strings.ToLower(doc.Theme), strings.ToLower(doc.Director),
		doc.Year, strings.ToLower(doc.Order), strings.ToLower(doc.Reviewer), strings.ToLower(doc.Discipline))

	err = row.Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "SQLSTATE 23505") {
			return -1, services.ErrDocAlreadyExists
		}
		return -1, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}

func (r *DocRepository) GetFiltered(ctx context.Context, doc *entities.Doc) ([]*entities.Doc, error) {
	const op = "repositories.DocRepository.GetFiltered"
	arraySize := 20

	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	filter := psql.Select("*").From("docs")
	if doc.Type != "" {
		filter = filter.Where(sq.Like{"type": ("%" + strings.ToLower(doc.Type) + "%")})
	}
	if doc.Group != "" {
		filter = filter.Where(sq.Like{"group_name": ("%" + strings.ToLower(doc.Group) + "%")})
	}
	if doc.FIO != "" {
		filter = filter.Where(sq.Like{"fio": ("%" + strings.ToLower(doc.FIO) + "%")})
	}
	if doc.Theme != "" {
		filter = filter.Where(sq.Like{"theme": ("%" + strings.ToLower(doc.Theme) + "%")})
	}
	if doc.Director != "" {
		filter = filter.Where(sq.Like{"director": ("%" + strings.ToLower(doc.Director) + "%")})
	}
	if doc.Year != 0 {
		filter = filter.Where(sq.Eq{"year": doc.Year})
	}
	if doc.Order != "" {
		filter = filter.Where(sq.Like{"order_name": ("%" + strings.ToLower(doc.Order) + "%")})
	}
	if doc.Reviewer != "" {
		filter = filter.Where(sq.Like{"reviewer": ("%" + strings.ToLower(doc.Reviewer) + "%")})
	}
	if doc.Discipline != "" {
		filter = filter.Where(sq.Like{"discipline": ("%" + strings.ToLower(doc.Discipline) + "%")})
	}

	sql, args, err := filter.ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	rows, err := r.Pool.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	docs := make([]*entities.Doc, 0, arraySize)
	for rows.Next() {
		doc, err := getDoc(op, rows)
		if err != nil {
			return nil, fmt.Errorf("%s: %w", op, err)
		}
		docs = append(docs, doc)
	}

	return docs, nil
}
