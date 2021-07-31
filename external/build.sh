#!/bin/bash

go get github.com/shurcooL/vfsgen
go run -tags=dev ./asset_dashboard.go
go mod tidy
