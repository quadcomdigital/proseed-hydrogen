export const CUSTOMER_METAFIELD_QUERY = `#graphql
  query CustomerMetafield {
    customer {
      metafield(namespace: "proseed", key: "wishlist") {
        value
      }
    }
  }
`;

export const CUSTOMER_METAFIELDS_SET_MUTATION = `#graphql
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key value namespace }
      userErrors { field message }
    }
  }
`;
