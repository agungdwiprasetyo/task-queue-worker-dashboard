import { useSubscription } from '@apollo/react-hooks';
import SUBSCRIBE_TASK from './graphql_listen_task';
import { toast } from 'react-toastify';

const ActiveTask = (taskName: string) => {
    try {
        if (!taskName || taskName == "") {
            toast.error("Invalid task name parameter");
            return {};
        }
        const { data, loading, error } = useSubscription(SUBSCRIBE_TASK, {
            variables: {
                "taskName": taskName
            }
        });

        if (error) {
            console.log(error);
        };
        return { data, loading };
    }
    catch (error) {
        toast.error('Check your connection');
    }
};

export default ActiveTask;
