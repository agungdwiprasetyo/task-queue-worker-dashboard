import gql from 'graphql-tag';

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
    }
}`;

export default TAGLINE;
