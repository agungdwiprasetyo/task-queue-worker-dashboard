import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { useState } from "react";
import ClientSubscriber from "src/components/menu/ClientSubscriber";
import Configuration from "src/components/menu/Configuration";
import { GetConfiguration, GetAllActiveSubscriber } from "src/components/menu/graphql";
import { IPropsClientSubscriber, IPropsConfiguration } from "src/components/menu/interface";

export const MenuOption = () => {
    const [configurationVisible, setConfigurationVisible] = useState(false);
    const [getConfiguration, { loading, data }] = GetConfiguration({});
    const propsConfiguration: IPropsConfiguration = {
        visible: configurationVisible,
        setVisible: setConfigurationVisible,
        data: data?.get_all_configuration,
        loading: loading,
        getData: getConfiguration
    }

    const [clientSubscriberVisible, setClientSubscriberVisible] = useState(false);
    const [getClientSubscriber, activeSubscriber] = GetAllActiveSubscriber({});
    const propsClientSubscriber: IPropsClientSubscriber = {
        visible: clientSubscriberVisible,
        setVisible: setClientSubscriberVisible,
        data: activeSubscriber?.data?.get_all_active_subscriber,
        loading: activeSubscriber?.loading,
        getData: getClientSubscriber
    }

    return (
        <Dropdown.Button type="ghost" size="large"
            icon={<MoreOutlined />}
            onClick={() => {
            }}
            overlay={(
                <Menu>
                    <Menu.Item onClick={() => {
                        getConfiguration();
                        setConfigurationVisible(true);
                    }
                    }>
                        Configuration
                    </Menu.Item>

                    <Menu.Item onClick={() => {
                        getClientSubscriber();
                        setClientSubscriberVisible(true);
                    }
                    }>
                        Client Subscribers
                    </Menu.Item>
                </Menu>
            )}>
            <Configuration {...propsConfiguration} />
            <ClientSubscriber {...propsClientSubscriber} />
        </Dropdown.Button>
    );
}

export default MenuOption;
