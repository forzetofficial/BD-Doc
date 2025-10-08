package entities

import coursev1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/course"

type Course struct {
	ID              int    `json:"id"`
	Title           string `json:"title" binding:"required"`
	Description     string `json:"description" binding:"required"`
	FullDescription string `json:"full_description" binding:"required"`
	Wrok            string `json:"work" binding:"required"`
	Difficulty      string `json:"difficulty" binding:"required"`
	Duration        int    `json:"duration"`
	Image           string `json:"image"`
}

func (r *Course) ToGRPC() *coursev1.Course {
	return &coursev1.Course{
		Id:              int32(r.ID),
		Title:           r.Title,
		Description:     r.Description,
		FullDescription: r.FullDescription,
		Work:            r.Wrok,
		Difficulty:      r.Difficulty,
		Duration:        int32(r.Duration),
		Image:           r.Image,
	}
}

type CreateLesson struct {
	Title    string `json:"title" binding:"required"`
	Type     string `json:"type" binding:"required"`
	Duration int    `json:"duration" binding:"required"`
	Content  string `json:"content" binding:"required"`
	Task     string `json:"task" binding:"required"`
}

func (r *CreateLesson) ToGRPC() *coursev1.CreateLesson {
	return &coursev1.CreateLesson{
		Title:    r.Title,
		Type:     r.Type,
		Duration: int32(r.Duration),
		Content:  r.Content,
		Task:     r.Task,
	}
}

type CreateTheme struct {
	Title   string         `json:"title" binding:"required"`
	Lessons []CreateLesson `json:"lessons"`
}

func (r *CreateTheme) ToGRPC() *coursev1.CreateTheme {
	lessons := make([]*coursev1.CreateLesson, len(r.Lessons))
	for i, obj := range r.Lessons {
		lessons[i] = obj.ToGRPC()
	}

	return &coursev1.CreateTheme{
		Title:   r.Title,
		Lessons: lessons,
	}
}

type CreateRequest struct {
	Title           string        `json:"title" binding:"required"`
	Description     string        `json:"description" binding:"required"`
	FullDescription string        `json:"full_description" binding:"required"`
	Wrok            string        `json:"work" binding:"required"`
	Difficulty      string        `json:"difficulty" binding:"required"`
	Duration        int           `json:"duration"`
	Image           string        `json:"image"`
	Themes          []CreateTheme `json:"themes"`
}

func (r *CreateRequest) ToGRPC() *coursev1.CreateRequest {
	themes := make([]*coursev1.CreateTheme, len(r.Themes))
	for i, obj := range r.Themes {
		themes[i] = obj.ToGRPC()
	}

	return &coursev1.CreateRequest{
		Title:           r.Title,
		Description:     r.Description,
		FullDescription: r.FullDescription,
		Work:            r.Wrok,
		Difficulty:      r.Difficulty,
		Duration:        int32(r.Duration),
		Image:           r.Image,
		Themes:          themes,
	}
}

type UpdateLesson struct {
	Id       *int32 `json:"id"`
	Title    string `json:"title"`
	Type     string `json:"type"`
	Duration int    `json:"duration"`
	Content  string `json:"content"`
	Task     string `json:"task"`
}

func (r *UpdateLesson) ToGRPC() *coursev1.UpdateLesson {
	return &coursev1.UpdateLesson{
		Id:       r.Id,
		Title:    r.Title,
		Type:     r.Type,
		Duration: int32(r.Duration),
		Content:  r.Content,
		Task:     r.Task,
	}
}

type UpdateTheme struct {
	Id      *int32         `json:"id"`
	Title   string         `json:"title"`
	Lessons []UpdateLesson `json:"lessons"`
}

func (r *UpdateTheme) ToGRPC() *coursev1.UpdateTheme {
	lessons := make([]*coursev1.UpdateLesson, len(r.Lessons))
	for i, obj := range r.Lessons {
		lessons[i] = obj.ToGRPC()
	}

	return &coursev1.UpdateTheme{
		Id:      r.Id,
		Title:   r.Title,
		Lessons: lessons,
	}
}

type UpdateRequest struct {
	Id              int           `json:"id"`
	Title           string        `json:"title"`
	Description     string        `json:"description"`
	FullDescription string        `json:"full_description"`
	Wrok            string        `json:"work"`
	Difficulty      string        `json:"difficulty"`
	Duration        int           `json:"duration"`
	Image           string        `json:"image"`
	Themes          []UpdateTheme `json:"themes"`
}

func (r *UpdateRequest) ToGRPC() *coursev1.UpdateCourseRequest {
	themes := make([]*coursev1.UpdateTheme, len(r.Themes))
	for i, obj := range r.Themes {
		themes[i] = obj.ToGRPC()
	}

	return &coursev1.UpdateCourseRequest{
		Title:           r.Title,
		Description:     r.Description,
		FullDescription: r.FullDescription,
		Work:            r.Wrok,
		Difficulty:      r.Difficulty,
		Duration:        int32(r.Duration),
		Image:           r.Image,
		Themes:          themes,
	}
}
