import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import LISTEN_ALL_JOB from './graphql_listen_all_job';
import RETRY_JOB from './graphql_retry_job';
import STOP_JOB from './graphql_stop_job';
import ADD_JOB from './graphql_add_job';
import STOP_ALL_JOB from './graphql_stop_all';
import RETRY_ALL_JOB from './graphql_retry_all_job';
import { ITaskListParam } from '../interface';
import DELETE_JOB from 'src/components/task/graphql/graphql_delete_job';

export const RetryJobGraphQL = () => {
    try {
        const [retryJob, { loading, error }] = useMutation(RETRY_JOB);
        return { retryJob, loading, error };
    }
    catch (error) {
        console.log(error);
    }
}

export const SubscribeTaskJobList = (params: ITaskListParam) => {
    try {
        const { data, loading, error } = useSubscription(LISTEN_ALL_JOB, {
            variables: { filter: params }
        });
        return { data, loading, error };
    }
    catch (error) {
        console.log(error);
    }
};

export const StopJobGraphQL = () => {
    try {
        const [stopJob, { loading, error }] = useMutation(STOP_JOB);
        return { stopJob, loading, error };
    }
    catch (error) {
        console.log(error);
    }
}

export const AddJob = () => {
    try {
        const [addJob, { loading, error }] = useMutation(ADD_JOB);
        return { addJob };
    }
    catch (error) {
        console.log(error);
    }
}

export const StopAllJob = () => {
    try {
        const [stopAllJob, { loading, error }] = useMutation(STOP_ALL_JOB);
        return { stopAllJob, loading, error };
    }
    catch (error) {
        console.log(error);
    }
}

export const RetryAllJob = () => {
    try {
        const [retryAllJob, { loading, error }] = useMutation(RETRY_ALL_JOB);
        return { retryAllJob, loading, error };
    }
    catch (error) {
        console.log(error);
    }
}

export const DeleteJobGraphQL = () => {
    try {
        const [deleteJob, { loading, error }] = useMutation(DELETE_JOB);
        return { deleteJob, loading, error };
    }
    catch (error) {
        console.log(error);
    }
}
