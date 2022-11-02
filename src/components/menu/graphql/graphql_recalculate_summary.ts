import { gql } from '@apollo/client';

const RECALCULATE_SUMMARY = gql`
mutation recalculateSummary() {
  recalculate_summary()
}`;

export default RECALCULATE_SUMMARY;
