import { Row, Skeleton } from "antd";
import { Footer } from "antd/lib/layout/layout";
import { IFooterComponentProps } from "src/components/footer/interface";
import { GetDashboard } from "../dashboard/graphql";

const FooterComponent = (props: IFooterComponentProps) => {

    let {
        build_number, server_started_at, version, go_version, loading,
        queue, persistent, queue_error, persistent_error
    } = props;
    if (Object.keys(props).length == 0) {
        const dashboardData = GetDashboard({});
        server_started_at = dashboardData?.data?.dashboard?.start_at
        version = dashboardData?.data?.dashboard?.version
        go_version = dashboardData?.data?.dashboard?.go_version
        build_number = dashboardData?.data?.dashboard?.build_number
        loading = dashboardData?.loading
        queue = dashboardData?.data?.dashboard?.dependency_detail?.queue_type
        persistent = dashboardData?.data?.dashboard?.dependency_detail?.persistent_type
        queue_error = dashboardData?.data?.dashboard?.dependency_health?.queue
        persistent_error = dashboardData?.data?.dashboard?.dependency_health?.persistent
    }

    const queueStatusColor = queue_error ? "#f5222d" : "#52c41a";
    const persistentStatusColor = persistent_error ? "#f5222d" : "#52c41a";

    return (
        <Footer style={{ bottom: "0", minHeight: "13vh" }}>
            {loading ? (
                <div className="text-center mb-5" style={{ bottom: "0", width: "50%", margin: "auto" }}>
                    <Skeleton.Button active={true} />
                </div>
            ) : (
                <>
                    {build_number ? (
                        <Row justify='center'>
                            <span>&nbsp;</span>build number:<span>&nbsp;</span><b>{build_number}</b>
                        </Row>
                    ) : <></>}
                    <Row justify='center'>
                        server started at <span>&nbsp;</span><b>{server_started_at}</b>
                    </Row>
                    <Row justify='center'>
                        candi version<span>&nbsp;</span><b>{version}</b><span>&nbsp;</span><h4>|</h4><span>&nbsp;</span>runtime version<span>&nbsp;</span><b>{go_version}</b>
                    </Row>
                    <Row justify='center' style={{ fontSize: "80%" }}>
                        <span className="colored-circle" style={{ backgroundColor: queueStatusColor }} /><pre>{`${queue} | `}</pre>
                        <span className="colored-circle" style={{ backgroundColor: persistentStatusColor }} /><pre>{persistent}</pre>
                    </Row>
                </>
            )}
        </Footer>
    );
}

export default FooterComponent;
