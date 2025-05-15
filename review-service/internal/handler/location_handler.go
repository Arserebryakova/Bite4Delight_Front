// internal/handler/location_handler.go
package handler

import (
	"embed"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

//go:embed data/locations.json
var locationsFS embed.FS

// Location describes one entry in locations.json
type Location struct {
	Address string `json:"address"`
	Place   string `json:"place"`
}

// RegisterLocationsRoute registers GET /api/locations
func RegisterLocationsRoute(r *gin.Engine) {
	r.GET("/api/locations", func(c *gin.Context) {
		// read the embedded file
		bs, err := locationsFS.ReadFile("data/locations.json")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot read locations.json"})
			return
		}
		// parse into slice
		var locs []Location
		if err := json.Unmarshal(bs, &locs); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid JSON format"})
			return
		}
		// build []string of "Address. Place"
		out := make([]string, len(locs))
		for i, l := range locs {
			out[i] = fmt.Sprintf("%s. %s", l.Address, l.Place)
		}
		c.JSON(http.StatusOK, out)
	})
}
