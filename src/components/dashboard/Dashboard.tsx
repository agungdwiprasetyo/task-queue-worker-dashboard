import TASK_LIST from './graphql_task_list'

const Dashboard = async (ctx) => {
    try {
        const { data, loading, error } = await ctx.apolloClient.query({
            query: TASK_LIST,
        });
        if (error) {
            return { error }
        }
        return { data, loading };
    } catch (error) {
        return {
            error: 'Failed to fetch',
        };
    }
};

export default Dashboard;
