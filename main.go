package main

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// --- Configuration ---
const (
	Port         = ":8080"
	StaticDir    = "./web/static"
	TemplatesDir = "./web/templates"
	DataDir      = "./data"
)

// --- Data Structures ---

type Project struct {
	ID               string   `json:"id"`
	Title            string   `json:"title"`
	ShortDescription string   `json:"shortDescription"`
	TechStack        []string `json:"techStack"`
	ThumbnailURL     string   `json:"thumbnailUrl"`
	GithubURL        string   `json:"githubUrl"`
	Category         string   `json:"category"`
}

type MemoryImage struct {
	ID          int    `json:"id"`
	Filename    string `json:"filename"`
	Description string `json:"description"` // Text on the back of the card
	Date        string `json:"date"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	CreatedAt   int64  `json:"createdAt"`
}

// --- In-Memory Data Store ---
var projects []Project

func init() {
	// Hardcoded Portfolio Data - "The Collection"
	projects = []Project{
		{
			ID:               "cognify",
			Title:            "Cognify",
			ShortDescription: "Cognitive load sonification & visualization via D3.js.",
			TechStack:        []string{"JavaScript", "D3.js", "Web Audio"},
			ThumbnailURL:     "/assets/images/thumbnails/cognify_thumb.jpg",
			GithubURL:        "https://github.com/DevKlim/cognitive-waveform",
			Category:         "Visualization",
		},
		{
			ID:               "sp500",
			Title:            "Market Sentiment",
			ShortDescription: "Transformer models predicting S&P 500 trends (61.5% acc).",
			TechStack:        []string{"Python", "PyTorch", "BERT"},
			ThumbnailURL:     "/assets/images/thumbnails/sp500_thumb.jpg",
			GithubURL:        "https://github.com/DevKlim/AlgoTrading_NewsSentiment_SP500",
			Category:         "Machine Learning",
		},
		{
			ID:               "datamaid",
			Title:            "DataMaid",
			ShortDescription: "Interactive analysis GUI with SQL/Pandas backend.",
			TechStack:        []string{"Python", "FastAPI", "React"},
			ThumbnailURL:     "/assets/images/thumbnails/datamaid_thumb.jpg",
			GithubURL:        "https://github.com/DevKlim/DataMaid",
			Category:         "Engineering",
		},
		{
			ID:               "mmo-server",
			Title:            "Private Server",
			ShortDescription: "High-concurrency game server backend in Ruby.",
			TechStack:        []string{"Ruby", "PostgreSQL", "Linux"},
			ThumbnailURL:     "/assets/images/thumbnails/mmo_thumb.jpg",
			GithubURL:        "https://github.com/DevKlim/MapleStory_PrivateServer",
			Category:         "Systems",
		},
	}
}

// --- Handlers ---

func handleIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join(TemplatesDir, "index.html"))
}

func handleResume(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join(TemplatesDir, "resume.html"))
}

func handleAPIProjects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

// Scans data/pictures directory and returns metadata
func handleAPIMemories(w http.ResponseWriter, r *http.Request) {
	imgDir := filepath.Join(DataDir, "pictures")
	var memories []MemoryImage

	entries, err := os.ReadDir(imgDir)
	if err != nil {
		json.NewEncoder(w).Encode([]MemoryImage{})
		return
	}

	idCounter := 1
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		ext := strings.ToLower(filepath.Ext(e.Name()))
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
			continue
		}

		// Get Image Dimensions
		fPath := filepath.Join(imgDir, e.Name())
		file, err := os.Open(fPath)
		if err != nil {
			continue
		}
		cfg, _, err := image.DecodeConfig(file)
		file.Close()
		if err != nil {
			continue
		}

		info, _ := e.Info()

		// Create description based on filename or generic text
		desc := fmt.Sprintf("Captured moment #%d. Details on the back.", idCounter)
		date := info.ModTime().Format("Jan 2006")

		memories = append(memories, MemoryImage{
			ID:          idCounter,
			Filename:    e.Name(),
			Description: desc,
			Date:        date,
			Width:       cfg.Width,
			Height:      cfg.Height,
			CreatedAt:   info.ModTime().Unix(),
		})
		idCounter++
	}

	// Sort by date descending
	sort.Slice(memories, func(i, j int) bool {
		return memories[i].CreatedAt > memories[j].CreatedAt
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(memories)
}

func main() {
	// Routes
	http.HandleFunc("/api/projects", handleAPIProjects)
	http.HandleFunc("/api/memories", handleAPIMemories)
	http.HandleFunc("/", handleIndex)
	http.HandleFunc("/resume", handleResume)

	// Static Files
	fs := http.FileServer(http.Dir(StaticDir))
	http.Handle("/css/", fs)
	http.Handle("/js/", fs)
	http.Handle("/assets/", fs)

	// Serve Data (Images)
	dataFs := http.FileServer(http.Dir(DataDir))
	http.Handle("/data/", http.StripPrefix("/data/", dataFs))

	fmt.Printf("Atelier Server running on localhost%s\n", Port)
	log.Fatal(http.ListenAndServe(Port, nil))
}