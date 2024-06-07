import { useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/react-hooks';
import CLEAN_JOB from './graphql_clean_job';
import SUBSCRIBE_TASK from './graphql_subscribe_task';
import DASHBOARD from './graphql_get_dashboard';
import { IFilterJobHistoryParam, ITaskListParam } from 'src/graphql/interface';
import LISTEN_JOB_DETAIL from 'src/graphql/graphql_listen_job_detail';
import GET_JOB_DETAIL from 'src/graphql/graphql_get_job_detail';
import LISTEN_ALL_JOB from 'src/graphql/graphql_listen_all_job';
import RETRY_JOB from 'src/graphql/graphql_retry_job';
import STOP_JOB from 'src/graphql/graphql_stop_job';
import ADD_JOB from 'src/graphql/graphql_add_job';
import STOP_ALL_JOB from 'src/graphql/graphql_stop_all';
import RETRY_ALL_JOB from 'src/graphql/graphql_retry_all_job';
import DELETE_JOB from 'src/graphql/graphql_delete_job';
import GET_COUNT_JOB from 'src/graphql/graphql_get_count_job';
import HOLD_JOB_TASK from 'src/graphql/graphql_hold_job_task';
import PARSE_CRON_EXPR from 'src/graphql/graphql_parse_cron_expr';

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

export const GetCountJob = (filter: ITaskListParam) => {
	try {
		return useLazyQuery(GET_COUNT_JOB, { variables: { filter: filter } });
	}
	catch (error) {
		console.log(error);
	}
}

export const HoldJobTask = () => {
	try {
		const [holdJobTask, { loading, error }] = useMutation(HOLD_JOB_TASK);
		return { holdJobTask };
	}
	catch (error) {
		console.log(error);
	}
}


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
		return useLazyQuery(GET_JOB_DETAIL);
	}
	catch (error) {
		console.log(error);
	}
}

export const ParseCronExpression = () => {
	try {
		return useLazyQuery(PARSE_CRON_EXPR);
	}
	catch (error) {
		console.log(error);
	}
}
