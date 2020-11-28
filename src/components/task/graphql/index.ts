import { useMutation, useSubscription } from '@apollo/react-hooks';
import LISTEN_JOB_TASK from './graphql_listen_task';
import RETRY_JOB from './graphql_retry_job'

export const RetryJobGraphQL = () => {
    try {
        const [retryJob, { }] = useMutation(RETRY_JOB);
        return { retryJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const SubscribeTaskList = (taskName: string, page: number, limit: number) => {
    try {
        if (!taskName || taskName == "") {
            throw ("Invalid task name parameter");
        }
        const { data, loading, error } = useSubscription(LISTEN_JOB_TASK, {
            variables: {
                "taskName": taskName,
                "page": page,
                "limit": limit,
            }
        });
        if (error) {
            console.log(error);
        };
        return { data, loading };
    }
    catch (error) {
        console.log(error);
    }
};