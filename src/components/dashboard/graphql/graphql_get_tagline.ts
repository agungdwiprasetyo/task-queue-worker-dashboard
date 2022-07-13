import { gql } from '@apollo/client';

const TAGLINE = gql`
query {
    tagline {
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
    }
}`;

export default TAGLINE;
