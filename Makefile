build:
	rm -rf .env
	rm -rf .next
	yarn run build
	yarn run export
	cd external && \
	go get github.com/shurcooL/vfsgen && \
	go run -tags=dev ./asset_dashboard.go && \
	go mod tidy && \
	cp assets_dashboard_build.go /opt/assets_dashboard_build.go
	# cp assets_dashboard_build.go ${CANDI_REPO_PATH}/candi/codebase/app/task_queue_worker/dashboard/assets_dashboard_build.go

	git config --global url."git@github.com:".insteadOf "https://github.com/"
	git config --global user.email "agungdwiprasetyo22@gmail.com"
	git config --global user.name "agungdwiprasetyo"
	git clone https://github.com/golangid/candi-plugin
	cd candi-plugin && \
	cp /opt/assets_dashboard_build.go task-queue-worker/assets_dashboard_build.go && \
	git add task-queue-worker/assets_dashboard_build.go && \
	git commit -m "task queue worker: update dashboard" && \
	git push origin master

clear:
	npm cache clean --force
	rm -rf node_modules
	rm -rf .next
