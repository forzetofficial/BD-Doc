package v1

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/common"
	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/entities"
	authv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/auth"
	userv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/user"
	"github.com/gin-gonic/gin"
)

type userRoutes struct {
	s   userv1.UserClient
	a   authv1.AuthClient
	log *slog.Logger
}

func NewUserRoutes(log *slog.Logger, handler *gin.RouterGroup, s userv1.UserClient, a authv1.AuthClient) {
	r := &userRoutes{
		log: log,
		s:   s,
		a:   a,
	}

	ga := handler.Group("/user")
	{
		ga.Use(authMiddleware(log, a))
		ga.PUT("/:id", r.update)
	}

	g := handler.Group("/user")
	{
		g.GET("/:id", r.get)
	}
}

// @Summary     Update user info
// @Description Update user info
// @ID          Update user info
// @Security ApiKeyAuth
// @Tags  	    User
// @Accept      json
// @Param 		info body entities.UserUpdateRequest false "info"
// @Produce     json
// @Success     200 {object} userv1.UpdateInfoResponse
// @Failure     400
// @Failure     401
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /user/{id} [put]
func (r *userRoutes) update(c *gin.Context) {
	const op = "userRoutes.update"

	log := r.log.With(
		slog.String("op", op),
	)

	urlParam, ok := c.Params.Get("id")
	if !ok {
		log.Error("bad url")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad url"})
		return
	}

	userID, err := strconv.Atoi(urlParam)
	if err != nil {
		slog.Error("bad type")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad type"})
		return
	}

	var req *entities.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": common.GetErrMessages(err).Error()})
		return
	}

	req.UserID = userID

	resp, err := r.s.UpdateInfo(c.Request.Context(), req.ToGRPC())
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Get user info
// @Description Get user info
// @ID          Get user info
// @Tags  	    User
// @Accept      json
// @Produce     json
// @Success     200 {object} userv1.GetInfoResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /user/{id} [get]
func (r *userRoutes) get(c *gin.Context) {
	const op = "userRoutes.get"
	log := r.log.With(
		slog.String("op", op),
	)

	urlParam, ok := c.Params.Get("id")
	if !ok {
		log.Error("bad url")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad url"})
		return
	}

	userID, err := strconv.Atoi(urlParam)
	if err != nil {
		slog.Error("bad type")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad type"})
		return
	}

	resp, err := r.s.GetInfo(c.Request.Context(), &userv1.GetInfoRequest{UserId: int64(userID)})
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}
