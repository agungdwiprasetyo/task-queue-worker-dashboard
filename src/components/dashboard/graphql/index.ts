import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import CLEAN_JOB from './graphql_clean_job';
import SUBSCRIBE_TASK from './graphql_subscribe_task';
import TAGLINE from './graphql_get_tagline';
import CLEAR_CLIENT_SUBSCRIBERS from './clear_all_client_subscriber';

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

export const GetTagLine = (opts: any) => {
	try {
		const { data } = useQuery(TAGLINE, { ...opts });
		return data;
	}
	catch (error) {
		console.log(error);
	}
}

export const ClearAllClientSubscriber = () => {
	try {
		const [clearClient, { }] = useMutation(CLEAR_CLIENT_SUBSCRIBERS);
		return { clearClient };
	}
	catch (error) {
		console.log(error);
	}
}
