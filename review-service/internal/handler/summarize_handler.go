// cmd/server/summarize_handler.go
package handler

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type SummReq struct {
	Texts []string `json:"texts"`
}

type SummRes struct {
	Summary string `json:"summary"`
}

func (h *ReviewHandler) Summarize(c *gin.Context) {
	var req SummReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	// marshal and send to Python service
	body, _ := json.Marshal(req)
	summarizerURL := os.Getenv("SUMMARIZER_URL") + "/summarize"
	resp, err := http.Post(summarizerURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "summarizer unreachable"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		data, _ := io.ReadAll(resp.Body)
		c.JSON(resp.StatusCode, gin.H{"error": string(data)})
		return
	}

	var out SummRes
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid summarizer response"})
		return
	}

	c.JSON(http.StatusOK, out)
}
