import { useLazyQuery, useSubscription } from "@apollo/react-hooks";
import GET_JOB_DETAIL from "src/components/job/graphql/graphql_get_job_detail";
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

export const GetDetailJob = () => {
    try {
        const res = useLazyQuery(GET_JOB_DETAIL);
        return res;
    }
    catch (error) {
        console.log(error);
    }
}
