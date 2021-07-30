import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import CLEAN_JOB from './graphql_clean_job';
import SUBSCRIBE_TASK from './graphql_subscribe_task';
import TAGLINE from './graphql_get_tagline';

export const CleanJobGraphQL = () => {
	try {
		const [cleanJob, { }] = useMutation(CLEAN_JOB);
		return { cleanJob };
	}
	catch (error) {
		console.log(error);
	}
}

export const SubscribeTaskList = () => {
	try {
		const { data, loading, error } = useSubscription(SUBSCRIBE_TASK);
		return { data, loading, error };
	}
	catch (error) {
		console.log(error);
	}
};

export const GetTagLine = () => {
	try {
		const { data } = useQuery(TAGLINE);
		return data;
	}
	catch (error) {
		console.log(error);
	}
}
