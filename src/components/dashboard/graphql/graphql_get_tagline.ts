import gql from 'graphql-tag';

const TAGLINE = gql`
query {
    tagline {
        version banner tagline
        memory_statistics {
            alloc total_alloc num_gc num_goroutines
        }
    }
}`;

export default TAGLINE;
