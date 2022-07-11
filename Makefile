release:
	rm -rf .env
	rm -rf .next
	yarn run build
	yarn run export
	cd external && \
	go get github.com/shurcooL/vfsgen && \
	go run -tags=dev ./asset_dashboard.go && \
	go mod tidy && \
	cp assets_dashboard_build.go ${CANDI_REPO_PATH}/candi/codebase/app/task_queue_worker/dashboard/assets_dashboard_build.go

clear:
	npm cache clean --force
	rm -rf node_modules
	rm -rf .next
