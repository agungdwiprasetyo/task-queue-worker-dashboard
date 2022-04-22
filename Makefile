release:
	rm -rf .env
	npm run build
	npm run export
	cd external && \
	go get github.com/shurcooL/vfsgen && \
	go run -tags=dev ./asset_dashboard.go && \
	go mod tidy