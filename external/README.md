# Build Result in Go from Next Export

Next.js build result generated to http.FileSystem (static files) in Go code

## Re-generate after export
```sh
$ go run -tags=dev ./asset_dashboard.go
```

## Example

```go
package main

import (
	"net/http"

	"github.com/agungdwiprasetyo/task-queue-worker-dashboard/external"
)

func main() {
    http.Handle("/", http.FileServer(external.Dashboard))

    if err := http.ListenAndServe(":8080", nil); err != nil {
        panic(err)
    }
}
```

open your browser at http://localhost:8080
