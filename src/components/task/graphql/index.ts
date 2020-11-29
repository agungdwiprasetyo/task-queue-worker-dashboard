import { useMutation, useSubscription } from '@apollo/react-hooks';
import LISTEN_JOB_TASK from './graphql_listen_task';
import RETRY_JOB from './graphql_retry_job';
import { ITaskListParam } from '../interface';

export const RetryJobGraphQL = () => {
    try {
        const [retryJob, { }] = useMutation(RETRY_JOB);
        return { retryJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const SubscribeTaskList = (params: ITaskListParam) => {
    try {
        if (!params.taskName || params.taskName == "") {
            return {};
        }
        const { data, loading, error } = useSubscription(LISTEN_JOB_TASK, {
            variables: {
                "taskName": params.taskName,
                "page": params.page,
                "limit": params.limit,
                "search": params.search,
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