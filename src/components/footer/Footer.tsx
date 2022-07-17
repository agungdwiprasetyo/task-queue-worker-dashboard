import { Row, Skeleton } from "antd";
import { Footer } from "antd/lib/layout/layout";
import { IFooterComponentProps } from "src/components/footer/interface";
import { GetDashboard } from "../dashboard/graphql";

const FooterComponent = (props: IFooterComponentProps) => {

    let { buildNumber, serverStartedAt, version, go_version, loading } = props;
    if (Object.keys(props).length == 0) {
        const dashboardData = GetDashboard({});
        serverStartedAt = dashboardData?.data?.dashboard?.start_at
        version = dashboardData?.data?.dashboard?.version
        go_version = dashboardData?.data?.dashboard?.go_version
        buildNumber = dashboardData?.data?.dashboard?.build_number
        loading = dashboardData?.loading
    }

    return (
        <Footer style={{ bottom: "0", minHeight: "13vh" }}>
            {loading ? (
                <div className="text-center mb-5" style={{ bottom: "0", width: "50%", margin: "auto" }}>
                    <Skeleton.Button active={true} />
                </div>
            ) : (
                <>
                    {buildNumber ? (
                        <Row justify='center'>
                            <span>&nbsp;</span>build number:<span>&nbsp;</span><b>{buildNumber}</b>
                        </Row>
                    ) : <></>}
                    <Row justify='center'>
                        server started at <span>&nbsp;</span><b>{serverStartedAt}</b>
                    </Row>
                    <Row justify='center'>
                        candi version<span>&nbsp;</span><b>{version}</b><span>&nbsp;</span><h4>|</h4><span>&nbsp;</span>runtime version<span>&nbsp;</span><b>{go_version}</b>
                    </Row>
                </>
            )}
        </Footer>
    );
}

export default FooterComponent;
