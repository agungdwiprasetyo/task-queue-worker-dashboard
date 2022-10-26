import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, Menu, notification } from "antd";
import { useState } from "react";
import ClientSubscriber from "src/components/menu/ClientSubscriber";
import Configuration from "src/components/menu/Configuration";
import { GetConfiguration, GetAllActiveSubscriber, RestoreFromSecondary } from "src/components/menu/graphql";
import { IPropsClientSubscriber, IPropsConfiguration, IPropsMenu } from "src/components/menu/interface";

export const MenuOption = (props: IPropsMenu) => {
    const [configurationVisible, setConfigurationVisible] = useState(false);
    const [getConfiguration, { loading, data }] = GetConfiguration({});
    const { restoreFromSecondary } = RestoreFromSecondary();
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
        client_id: props.clientId,
        visible: clientSubscriberVisible,
        setVisible: setClientSubscriberVisible,
        data: activeSubscriber?.data?.get_all_active_subscriber,
        loading: activeSubscriber?.loading,
        getData: getClientSubscriber
    }

    return (
        <Dropdown.Button type="ghost" size="large"
            icon={<MenuOutlined />}
            onClick={() => { }}
            overlay={(
                <Menu>
                    <Menu.Item onClick={() => {
                        getConfiguration();
                        setConfigurationVisible(true);
                    }}>
                        Configuration
                    </Menu.Item>

                    <Menu.Item onClick={() => {
                        getClientSubscriber();
                        setClientSubscriberVisible(true);
                    }}>
                        Client Subscribers
                    </Menu.Item>

                    {props.useSecondaryPersistent ?
                        <Menu.Item onClick={() => {
                            restoreFromSecondary().then((data) => {
                                if (data?.data?.restore_from_secondary?.total_data > 0) {
                                    notification.success({
                                        message: "Success",
                                        description: data?.data?.restore_from_secondary?.message
                                    })
                                } else {
                                    notification.info({
                                        message: "Empty data in secondary persistent",
                                        description: data?.data?.restore_from_secondary?.message
                                    })
                                }
                            })
                        }}>
                            Restore From Secondary
                        </Menu.Item>
                        : <></>}
                </Menu>
            )}>
            <Configuration {...propsConfiguration} />
            <ClientSubscriber {...propsClientSubscriber} />
        </Dropdown.Button>
    );
}

export default MenuOption;
