import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import CLEAN_JOB from './graphql_clean_job';
import SUBSCRIBE_TASK from './graphql_subscribe_task';
import DASHBOARD from './graphql_get_dashboard';

export const CleanJobGraphQL = () => {
	try {
		const [cleanJob, { loading, error }] = useMutation(CLEAN_JOB);
		return { cleanJob, loading, error };
	}
	catch (error) {
		console.log(error);
	}
}

export const SubscribeTaskList = (page, limit: number, search: string) => {
	try {
		const { data, loading, error } = useSubscription(SUBSCRIBE_TASK, {
			variables: {
				page: page, limit: limit, search: search
			}
		});
		return { data, loading, error };
	}
	catch (error) {
		console.log(error);
	}
};

export const GetDashboard = (opts: any) => {
	try {
		const { loading, data } = useQuery(DASHBOARD, { ...opts });
		return { loading, data };
	}
	catch (error) {
		console.log(error);
	}
}

