import { QueryLazyOptions } from "@apollo/react-hooks";
import { Dispatch, SetStateAction } from "react";
import { OperationVariables } from "react-apollo";

export interface IPropsConfiguration {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    data: [IConfiguration];
    loading: boolean;
    getData: (options?: QueryLazyOptions<OperationVariables>) => void;
}
export interface IConfiguration {
    name: string;
    key: string;
    value: string;
    is_active: boolean;
}

export interface IPropsClientSubscriber {
    client_id: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    data: [IClientSubscriber];
    loading: boolean;
    getData: (options?: QueryLazyOptions<OperationVariables>) => void;
}

export interface IClientSubscriber {
    client_id: string;
    page_name: string;
    page_filter: string;
}
