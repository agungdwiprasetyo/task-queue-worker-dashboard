import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import LISTEN_JOB_TASK from './graphql_listen_task';
import RETRY_JOB from './graphql_retry_job';
import STOP_JOB from './graphql_stop_job';
import ADD_JOB from './graphql_add_job';
import STOP_ALL_JOB from './graphql_stop_all';
import RETRY_ALL_JOB from './graphql_retry_all_job';
import GET_JOB_DETAIL from './graphql_get_job_detail';
import { ITaskListParam } from '../interface';
import DELETE_JOB from 'src/components/task/graphql/graphql_delete_job';

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
                "status": params.status,
                "startDate": params.startDate,
                "endDate": params.endDate,
            }
        });
        return { data, loading, error };
    }
    catch (error) {
        console.log(error);
    }
};

export const StopJobGraphQL = () => {
    try {
        const [stopJob, { }] = useMutation(STOP_JOB);
        return { stopJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const AddJob = () => {
    try {
        const [addJob, { }] = useMutation(ADD_JOB);
        return { addJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const StopAllJob = () => {
    try {
        const [stopAllJob, { }] = useMutation(STOP_ALL_JOB);
        return { stopAllJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const RetryAllJob = () => {
    try {
        const [retryAllJob, { }] = useMutation(RETRY_ALL_JOB);
        return { retryAllJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const GetDetailJob = (job_id: string) => {
    try {
        const { data, loading, error } = useQuery(
            GET_JOB_DETAIL,
            { variables: { job_id: job_id }, fetchPolicy: "no-cache" },
        );
        return { data, loading, error };
    }
    catch (error) {
        console.log(error);
    }
}

export const DeleteJobGraphQL = () => {
    try {
        const [deleteJob, { }] = useMutation(DELETE_JOB);
        return { deleteJob };
    }
    catch (error) {
        console.log(error);
    }
}
