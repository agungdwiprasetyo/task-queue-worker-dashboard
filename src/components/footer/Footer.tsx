import { Row } from "antd";
import { Footer } from "antd/lib/layout/layout";
import { IFooterComponentProps } from "src/components/footer/interface";
import { GetTagLine } from "../dashboard/graphql";

const FooterComponent = (props: IFooterComponentProps) => {

    let { buildNumber, serverStartedAt, version } = props;
    if (Object.keys(props).length == 0) {
        const dataTagline = GetTagLine({});
        serverStartedAt = dataTagline?.tagline?.start_at
        version = dataTagline?.tagline?.version
        buildNumber = dataTagline?.tagline?.build_number
    }

    return (
        <Footer style={{ bottom: "0", minHeight: "12vh" }}>
            {props?.buildNumber ? (
                <Row justify='center'>
                    <span>&nbsp;</span>build number:<span>&nbsp;</span><b>{buildNumber}</b>
                </Row>
            ) : <></>}
            <Row justify='center'>
                server started at <span>&nbsp;</span><b>{serverStartedAt}</b>
            </Row>
            <Row justify='center'>
                candi version<span>&nbsp;</span><b>{version}</b>
            </Row>
        </Footer>
    );
}

export default FooterComponent;
