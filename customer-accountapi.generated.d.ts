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

export type CustomerMetafieldQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type CustomerMetafieldQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value'>
    >;
  };
};

export type MetafieldsSetMutationVariables = CustomerAccountAPI.Exact<{
  metafields:
    | Array<CustomerAccountAPI.MetafieldsSetInput>
    | CustomerAccountAPI.MetafieldsSetInput;
}>;

export type MetafieldsSetMutation = {
  metafieldsSet?: CustomerAccountAPI.Maybe<{
    metafields?: CustomerAccountAPI.Maybe<
      Array<Pick<CustomerAccountAPI.Metafield, 'key' | 'value' | 'namespace'>>
    >;
    userErrors: Array<
      Pick<CustomerAccountAPI.MetafieldsSetUserError, 'field' | 'message'>
    >;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerAccountPing {\n    customer {\n      id\n    }\n  }\n': {
    return: CustomerAccountPingQuery;
    variables: CustomerAccountPingQueryVariables;
  };
  '#graphql\n  query CustomerMetafield {\n    customer {\n      metafield(namespace: "proseed", key: "wishlist") {\n        value\n      }\n    }\n  }\n': {
    return: CustomerMetafieldQuery;
    variables: CustomerMetafieldQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {\n    metafieldsSet(metafields: $metafields) {\n      metafields { key value namespace }\n      userErrors { field message }\n    }\n  }\n': {
    return: MetafieldsSetMutation;
    variables: MetafieldsSetMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
