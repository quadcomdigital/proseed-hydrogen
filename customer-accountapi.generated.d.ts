/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type CustomerAccountPingQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type CustomerAccountPingQuery = {
  customer: Pick<CustomerAccountAPI.Customer, 'id'>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerAccountPing {\n    customer {\n      id\n    }\n  }\n': {
    return: CustomerAccountPingQuery;
    variables: CustomerAccountPingQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
