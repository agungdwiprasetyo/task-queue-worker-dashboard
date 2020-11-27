import { useSubscription } from '@apollo/react-hooks';
import SUBSCRIBE_TASK from './graphql_subscribe_task';
import { toast } from 'react-toastify';

const Dashboard = () => {
    try {
        const { data, loading, error } = useSubscription(SUBSCRIBE_TASK);

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

export default Dashboard;
