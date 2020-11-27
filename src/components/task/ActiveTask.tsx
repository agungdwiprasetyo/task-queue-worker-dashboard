import { useSubscription } from '@apollo/react-hooks';
import SUBSCRIBE_TASK from './graphql_listen_task';
import { toast } from 'react-toastify';

const ActiveTask = (taskName: string, page: number, limit: number) => {
    try {
        if (!taskName || taskName == "") {
            toast.error("Invalid task name parameter");
            return {};
        }
        const { data, loading, error } = useSubscription(SUBSCRIBE_TASK, {
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
        toast.error('Error');
    }
};

export default ActiveTask;
