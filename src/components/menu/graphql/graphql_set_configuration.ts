import { gql } from '@apollo/client';

const SET_CONFIGURATION = gql`
mutation setConfiguration($param: SetConfigurationInputResolver!) {
  set_configuration(config: $param)
}`;

export default SET_CONFIGURATION;
