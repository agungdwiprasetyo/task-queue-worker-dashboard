import { gql } from '@apollo/client';

const PARSE_CRON_EXPR = gql`
query parseCronExpr($expr: String!) {
  date: parse_cron_expression(expr: $expr)
}`;

export default PARSE_CRON_EXPR;
