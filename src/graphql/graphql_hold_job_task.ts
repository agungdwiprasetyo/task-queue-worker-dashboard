import gql from 'graphql-tag';

const HOLD_JOB_TASK = gql`
mutation holdJobTask($task_name: String!, $is_auto_switch: Boolean!, $switch_interval: String, $first_switch: String) {
  hold_job_task(task_name: $task_name, is_auto_switch: $is_auto_switch, switch_interval: $switch_interval, first_switch: $first_switch)
}`;

export default HOLD_JOB_TASK;