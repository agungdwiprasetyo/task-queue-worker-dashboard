import { gql } from '@apollo/client';

const RESTORE_FROM_SECONDARY = gql`
mutation {
  restore_from_secondary {
    total_data message
  }
}`;

export default RESTORE_FROM_SECONDARY;
