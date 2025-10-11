package entities

import (
	"fmt"
)

type Doc struct {
	ID         int
	Type       string
	Group      string
	FIO        string
	Theme      string
	Director   string
	Year       int
	Order      string
	Reviewer   string
	Discipline string
}

func (a Doc) String() string {
	return fmt.Sprintf("ID: %v; Type: %v; Group: %v; FIO: %v; Theme: %v; Director: %v; Year: %v; Order: %v; Reviewer: %v; Discipline: %v",
		a.ID, a.Type, a.Group, a.FIO, a.Theme, a.Director, a.Year, a.Order, a.Reviewer, a.Discipline)
}
