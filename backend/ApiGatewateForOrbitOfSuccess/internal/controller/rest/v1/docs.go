package v1

import (
	"log/slog"
	"net/http"

	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/common"
	"github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/internal/entities"
	docsv1 "github.com/Homyakadze14/ApiGatewateForOrbitOfSuccess/proto/gen/docs"
	"github.com/gin-gonic/gin"
)

type docsRoutes struct {
	s   docsv1.DocsClient
	log *slog.Logger
}

func NewDocsRoutes(log *slog.Logger, handler *gin.RouterGroup, s docsv1.DocsClient) {
	r := &docsRoutes{
		log: log,
		s:   s,
	}

	g := handler.Group("/docs")
	{
		g.POST("/register", r.create)
		g.POST("/delete", r.delete)
		g.POST("/filtered", r.getFilterd)
		g.POST("/search", r.search)
		g.POST("/update", r.update)
	}
}

// @Summary     Create
// @Description Create
// @ID          Create
// @Tags  	    Docs
// @Accept      json
// @Param 		create body entities.CreateRequest false "create"
// @Produce     json
// @Success     200 {object} entities.SuccessResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /auth/create [post]
func (r *docsRoutes) create(c *gin.Context) {
	const op = "docsRoutes.create"

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
// @ID          Delte
// @Tags  	    Docs
// @Accept      json
// @Param 		delete body entities.DeleteRequest false "delete"
// @Produce     json
// @Success     200 {object} entities.SuccessResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /auth/delete [post]
func (r *docsRoutes) delete(c *gin.Context) {
	const op = "docsRoutes.delete"

	log := r.log.With(
		slog.String("op", op),
	)

	var req *entities.DeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": common.GetErrMessages(err).Error()})
		return
	}

	resp, err := r.s.Delete(c.Request.Context(), req.ToGRPC())
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Get filtererd
// @Description Get filtererd
// @ID          Get filtererd
// @Tags  	    Docs
// @Accept      json
// @Param 		delete body entities.GetFilteredRequest false "get filtered"
// @Produce     json
// @Success     200 {object} entities.GetResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /auth/filtered [post]
func (r *docsRoutes) getFilterd(c *gin.Context) {
	const op = "docsRoutes.getFilterd"

	log := r.log.With(
		slog.String("op", op),
	)

	var req *entities.GetFilteredRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": common.GetErrMessages(err).Error()})
		return
	}

	resp, err := r.s.GetFiltered(c.Request.Context(), req.ToGRPC())
	if err != nil {
		code, err := common.GetProtoErrWithStatusCode(err)
		log.Error(err.Error())
		c.JSON(code, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary     Search
// @Description Search
// @ID          Search
// @Tags  	    Docs
// @Accept      json
// @Param 		delete body entities.SearchRequest false "search"
// @Produce     json
// @Success     200 {object} entities.GetResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /auth/search [post]
func (r *docsRoutes) search(c *gin.Context) {
	const op = "docsRoutes.search"

	log := r.log.With(
		slog.String("op", op),
	)

	var req *entities.SearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": common.GetErrMessages(err).Error()})
		return
	}

	resp, err := r.s.Search(c.Request.Context(), req.ToGRPC())
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
// @Tags  	    Docs
// @Accept      json
// @Param 		update body entities.UpdateRequest false "update"
// @Produce     json
// @Success     200 {object} entities.SuccessResponse
// @Failure     400
// @Failure     404
// @Failure     500
// @Failure     503
// @Router      /auth/update [post]
func (r *docsRoutes) update(c *gin.Context) {
	const op = "docsRoutes.update"

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
