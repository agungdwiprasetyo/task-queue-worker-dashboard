//go:build ignore
// +build ignore

package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/shurcooL/vfsgen"
)

// This program uses `github.com/shurcooL/vfsgen` to generate the `assets`
// variable. `assets` statically implements an `http.FileSystem` rooted at
// `/static/`, it embeds the files that statsviz serves.
//
// While working on statsviz web interface, it's easier to directly serve the
// content of the /static directory rather than regenerating the assets after
// each modification. Passing `-tags dev` to `go build` will do just that, the
// directory served will be that of your filesystem.
//
// However to commit the modifications of the /static directory, `assets` must
// be regenerated, to do so just call `go generate` from the project root.
// With Go modules enabled, this will download the latest version of
// github.com/shurcooL/vfsgen and update `assets_vfsdata.go` so that it
// reflects the new content of the /static directory. Then, commits both
// /static and assets_vfsdata.go.

func main() {
	filename := "assets_dashboard_build.go"
	err := vfsgen.Generate(http.Dir("out"), vfsgen.Options{
		PackageName:  "dashboard",
		BuildTags:    "!dev",
		VariableName: "Dashboard",
		Filename:     filename,
	})
	if err != nil {
		log.Fatalln("generate dashboard", err)
	}

	fl, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	flStr := string(fl)
	idx := strings.Index(flStr, `fs["/"].(*vfsgen۰DirInfo)`)
	idx = idx - 5

	flStr = flStr[:idx] + `
		"/task": &vfsgen۰DirInfo{
			name:    "/task",
			modTime: time.Date(2022, 3, 3, 17, 9, 34, 687442386, time.UTC),
		},
		"/job": &vfsgen۰DirInfo{
			name:    "/job",
			modTime: time.Date(2022, 3, 3, 17, 9, 34, 687442386, time.UTC),
		},
		"/expired": &vfsgen۰DirInfo{
			name:    "/expired",
			modTime: time.Date(2022, 3, 3, 17, 9, 34, 687442386, time.UTC),
		},` + flStr[idx:]

	idx = strings.Index(flStr, `return fs`)
	idx = idx - 2

	flStr = flStr[:idx] + `	fs["/task"].(*vfsgen۰DirInfo).entries = []os.FileInfo{
		fs["/404.html"].(os.FileInfo),
		fs["/404.html.html"].(os.FileInfo),
		fs["/_next"].(os.FileInfo),
		fs["/icon-192.png"].(os.FileInfo),
		fs["/icon-512.png"].(os.FileInfo),
		fs["/index.html"].(os.FileInfo),
		fs["/job.html"].(os.FileInfo),
		fs["/manifest.json"].(os.FileInfo),
		fs["/task.html"].(os.FileInfo),
		fs["/expired.html"].(os.FileInfo),
	}
	fs["/job"].(*vfsgen۰DirInfo).entries = []os.FileInfo{
		fs["/404.html"].(os.FileInfo),
		fs["/404.html.html"].(os.FileInfo),
		fs["/_next"].(os.FileInfo),
		fs["/icon-192.png"].(os.FileInfo),
		fs["/icon-512.png"].(os.FileInfo),
		fs["/index.html"].(os.FileInfo),
		fs["/job.html"].(os.FileInfo),
		fs["/manifest.json"].(os.FileInfo),
		fs["/task.html"].(os.FileInfo),
		fs["/expired.html"].(os.FileInfo),
	}
	fs["/expired"].(*vfsgen۰DirInfo).entries = []os.FileInfo{
		fs["/404.html"].(os.FileInfo),
		fs["/404.html.html"].(os.FileInfo),
		fs["/_next"].(os.FileInfo),
		fs["/icon-192.png"].(os.FileInfo),
		fs["/icon-512.png"].(os.FileInfo),
		fs["/index.html"].(os.FileInfo),
		fs["/job.html"].(os.FileInfo),
		fs["/manifest.json"].(os.FileInfo),
		fs["/task.html"].(os.FileInfo),
		fs["/expired.html"].(os.FileInfo),
	}
	fs["/task/index.html"] = fs["/task.html"]
	fs["/job/index.html"] = fs["/job.html"]
	fs["/expired/index.html"] = fs["/expired.html"]
` + flStr[idx:]

	if err := os.WriteFile(filename, []byte(flStr), 0644); err != nil {
		panic(err)
	}
}
