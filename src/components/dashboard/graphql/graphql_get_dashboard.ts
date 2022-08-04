import { gql } from '@apollo/client';

const DASHBOARD = gql`
query {
    dashboard {
        version go_version banner tagline start_at build_number
        config {
            with_persistent
        }
        memory_statistics {
            alloc total_alloc num_gc num_goroutines
        }
        dependency_health {
            persistent queue
        }
        dependency_detail {
            persistent_type
            queue_type
        }
    }
}`;

export default DASHBOARD;
