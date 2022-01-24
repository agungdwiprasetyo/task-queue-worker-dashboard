import { Row } from "antd";
import { Footer } from "antd/lib/layout/layout";
import { IFooterComponentProps } from "src/components/footer/interface";

const FooterComponent = (props: IFooterComponentProps) => {

    return (
        <Footer style={{ bottom: "0", minHeight: "12vh" }}>
            {props?.buildNumber ? (
                <Row justify='center'>
                    <span>&nbsp;</span>build number:<span>&nbsp;</span><b>{props?.buildNumber}</b>
                </Row>
            ) : <></>}
            <Row justify='center'>
                server started at <span>&nbsp;</span><b>{props?.serverStartedAt}</b>
            </Row>
            <Row justify='center'>
                candi version<span>&nbsp;</span><b>{props?.version}</b>
            </Row>
        </Footer>
    );
}

export default FooterComponent;
