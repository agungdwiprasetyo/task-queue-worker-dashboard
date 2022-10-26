import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import GET_CONFIGURATION from './graphql_get_all_configuration';
import SET_CONFIGURATION from './graphql_set_configuration';
import GET_ALL_ACTIVE_SUBSCRIBERS from './graphql_get_all_active_subscriber';
import KILL_CLIENT_SUBSCRIBER from './graphql_kill_client_subscriber';
import CLEAR_CLIENT_SUBSCRIBERS from './clear_all_client_subscriber';
import RESTORE_FROM_SECONDARY from './graphql_restore_from_secondary';

export const GetConfiguration = (opts: any) => {
	try {
		const res = useLazyQuery(GET_CONFIGURATION, { ...opts });
		return res;
	}
	catch (error) {
		console.log(error);
	}
}

export const SetConfiguration = () => {
	try {
		const [setConfiguration, { loading, error }] = useMutation(SET_CONFIGURATION, {
			onError: (err) => { }
		});
		return { setConfiguration, error };
	}
	catch (error) {
		console.log(error);
	}
}

export const GetAllActiveSubscriber = (opts: any) => {
	try {
		const res = useLazyQuery(GET_ALL_ACTIVE_SUBSCRIBERS, { ...opts });
		return res;
	}
	catch (error) {
		console.log(error);
	}
}

export const KillClientSubscriber = () => {
	try {
		const [killClientSubscriber, { loading, error }] = useMutation(KILL_CLIENT_SUBSCRIBER);
		return { killClientSubscriber };
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

export const RestoreFromSecondary = () => {
	try {
		const [restoreFromSecondary, { }] = useMutation(RESTORE_FROM_SECONDARY);
		return { restoreFromSecondary };
	}
	catch (error) {
		console.log(error);
	}
}
