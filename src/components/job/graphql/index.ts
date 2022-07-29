import { useSubscription } from "@apollo/react-hooks";
import { IFilterJobHistoryParam } from "src/components/job/interface";
import LISTEN_JOB_DETAIL from './graphql_listen_job_detail';

export const SubscribeJobDetail = (jobId: string, filter: IFilterJobHistoryParam) => {
    try {
        const { data, loading, error } = useSubscription(LISTEN_JOB_DETAIL, {
            variables: {
                "job_id": jobId,
                "filter": filter
            }
        });
        return { data, loading, error };
    }
    catch (error) {
        console.log(error);
    }
};
