package v1

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/common"
	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/entities"
	coursev1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/course"
	"github.com/gin-gonic/gin"
)

type courseRoutes struct {
	s   coursev1.CourseServiceClient
	log *slog.Logger
}

func NewCourseRoutes(log *slog.Logger, handler *gin.RouterGroup, s coursev1.CourseServiceClient) {
	r := &courseRoutes{
		log: log,
		s:   s,
	}

	g := handler.Group("/course")
	{
		g.GET("/", r.getAll)
		g.GET("/:id", r.get)
		g.POST("/", r.create)
		g.PUT("/", r.update)
		g.DELETE("/:id", r.delete)
	}
}

// @Summary     Get all
// @Description Get all
// @ID          Get all
// @Tags  	    Course
// @Produce     json
// @Success     200 {object} coursev1.GetResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /course [get]
func (r *courseRoutes) getAll(c *gin.Context) {
	const op = "courseRoutes.getAll"

	log := r.log.With(
		slog.String("op", op),
	)

	resp, err := r.s.GetAll(c.Request.Context(), nil)
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Get
// @Description Get
// @ID          Get
// @Tags  	    Course
// @Produce     json
// @Success     200 {object} coursev1.GetCourseResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /course/{id} [get]
func (r *courseRoutes) get(c *gin.Context) {
	const op = "courseRoutes.get"

	log := r.log.With(
		slog.String("op", op),
	)

	urlParam, ok := c.Params.Get("id")
	if !ok {
		log.Error("bad url")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad url"})
		return
	}

	id, err := strconv.Atoi(urlParam)
	if err != nil {
		slog.Error("bad type")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad type"})
		return
	}

	resp, err := r.s.Get(c.Request.Context(), &coursev1.GetCourseRequest{Id: int32(id)})
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Create
// @Description Create
// @ID          Create
// @Tags  	    Course
// @Accept      json
// @Param 		create body entities.CreateRequest false "create"
// @Produce     json
// @Success     200 {object} coursev1.SuccessResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /course [post]
func (r *courseRoutes) create(c *gin.Context) {
	const op = "courseRoutes.create"

	log := r.log.With(
		slog.String("op", op),
	)

	var req *entities.CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": common.GetErrMessages(err).Error()})
		return
	}

	resp, err := r.s.Create(c.Request.Context(), req.ToGRPC())
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Delete
// @Description Delete
// @ID          Delete
// @Tags  	    Course
// @Produce     json
// @Success     200 {object} coursev1.SuccessResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /course/{id} [delete]
func (r *courseRoutes) delete(c *gin.Context) {
	const op = "courseRoutes.delete"

	log := r.log.With(
		slog.String("op", op),
	)

	urlParam, ok := c.Params.Get("id")
	if !ok {
		log.Error("bad url")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad url"})
		return
	}

	id, err := strconv.Atoi(urlParam)
	if err != nil {
		slog.Error("bad type")
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad type"})
		return
	}

	resp, err := r.s.Delete(c.Request.Context(), &coursev1.DeleteCourseRequest{Id: int32(id)})
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Update
// @Description Update
// @ID          Update
// @Tags  	    Course
// @Accept      json
// @Param 		update body entities.UpdateRequest false "update"
// @Produce     json
// @Success     200 {object} coursev1.SuccessResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /course [put]
func (r *courseRoutes) update(c *gin.Context) {
	const op = "courseRoutes.update"

	log := r.log.With(
		slog.String("op", op),
	)

	var req *entities.UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": common.GetErrMessages(err).Error()})
		return
	}

	resp, err := r.s.Update(c.Request.Context(), req.ToGRPC())
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}
