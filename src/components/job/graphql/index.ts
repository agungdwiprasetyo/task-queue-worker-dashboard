import { useSubscription } from "@apollo/react-hooks";
import LISTEN_JOB_DETAIL from './graphql_listen_job_detail';

export const SubscribeJobDetail = (jobId: string) => {
    try {
        const { data, loading, error } = useSubscription(LISTEN_JOB_DETAIL, {
            variables: {
                "job_id": jobId,
            }
        });
        return { data, loading, error };
    }
    catch (error) {
        console.log(error);
    }
};
