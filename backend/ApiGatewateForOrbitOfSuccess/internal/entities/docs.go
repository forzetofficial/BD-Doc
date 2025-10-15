package entities

import (
	docv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/docs"
)

type CreateRequest struct {
	Type       string `json:"type" binding:"required"`
	Group      string `json:"group" binding:"required"`
	FIO        string `json:"fio" binding:"required"`
	Theme      string `json:"theme" binding:"required"`
	Director   string `json:"director" binding:"required"`
	Year       int    `json:"year" binding:"required"`
	Order      string `json:"order" binding:"required"`
	Reviewer   string `json:"reviewer" binding:"required"`
	Discipline string `json:"discipline" binding:"required"`
}

func (r *CreateRequest) ToGRPC() *docv1.CreateRequest {
	return &docv1.CreateRequest{
		Type:       r.Type,
		Group:      r.Group,
		Fio:        r.FIO,
		Theme:      r.Theme,
		Director:   r.Director,
		Year:       int32(r.Year),
		Order:      r.Order,
		Reviewer:   r.Reviewer,
		Discipline: r.Discipline,
	}
}

type DeleteRequest struct {
	ID int `json:"id" binding:"required"`
}

func (r *DeleteRequest) ToGRPC() *docv1.DeleteRequest {
	return &docv1.DeleteRequest{
		Id: int64(r.ID),
	}
}

type GetFilteredRequest struct {
	Type       string `json:"type" binding:"required"`
	Group      string `json:"group" binding:"required"`
	FIO        string `json:"fio" binding:"required"`
	Theme      string `json:"theme" binding:"required"`
	Director   string `json:"director" binding:"required"`
	Year       int    `json:"year" binding:"required"`
	Order      string `json:"order" binding:"required"`
	Reviewer   string `json:"reviewer" binding:"required"`
	Discipline string `json:"discipline" binding:"required"`
}

func (r *GetFilteredRequest) ToGRPC() *docv1.GetFilteredRequest {
	return &docv1.GetFilteredRequest{
		Type:       r.Type,
		Group:      r.Group,
		Fio:        r.FIO,
		Theme:      r.Theme,
		Director:   r.Director,
		Year:       int32(r.Year),
		Order:      r.Order,
		Reviewer:   r.Reviewer,
		Discipline: r.Discipline,
	}
}

type SearchRequest struct {
	SearchLine string `json:"search_line" binding:"required"`
}

func (r *SearchRequest) ToGRPC() *docv1.SearchRequest {
	return &docv1.SearchRequest{
		SearchLine: r.SearchLine,
	}
}

type UpdateRequest struct {
	ID         int    `json:"id" binding:"required"`
	Type       string `json:"type" binding:"required"`
	Group      string `json:"group" binding:"required"`
	FIO        string `json:"fio" binding:"required"`
	Theme      string `json:"theme" binding:"required"`
	Director   string `json:"director" binding:"required"`
	Year       int    `json:"year" binding:"required"`
	Order      string `json:"order" binding:"required"`
	Reviewer   string `json:"reviewer" binding:"required"`
	Discipline string `json:"discipline" binding:"required"`
}

func (r *UpdateRequest) ToGRPC() *docv1.UpdateRequest {
	return &docv1.UpdateRequest{
		Id:         int64(r.ID),
		Type:       r.Type,
		Group:      r.Group,
		Fio:        r.FIO,
		Theme:      r.Theme,
		Director:   r.Director,
		Year:       int32(r.Year),
		Order:      r.Order,
		Reviewer:   r.Reviewer,
		Discipline: r.Discipline,
	}
}
