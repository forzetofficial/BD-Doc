package entities

import userv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/user"

type UserUpdateRequest struct {
	UserID     int    `json:"-"`
	Firstname  string `json:"firstname" binding:"required"`
	Middlename string `json:"middlename" binding:"required"`
	Lastname   string `json:"lastname" binding:"required"`
	Gender     string `json:"gender" binding:"required"`
	Phone      string `json:"phone" binding:"required"`
	IconURL    string `json:"icon_url"`
}

func (r *UserUpdateRequest) ToGRPC() *userv1.UpdateInfoRequest {
	return &userv1.UpdateInfoRequest{
		UserId:     int64(r.UserID),
		Firstname:  r.Firstname,
		Middlename: r.Middlename,
		Lastname:   r.Lastname,
		Gender:     r.Gender,
		Phone:      r.Phone,
		IconUrl:    r.IconURL,
	}
}
