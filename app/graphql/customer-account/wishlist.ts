export const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist {
    customer {
      wishlist {
        items(first: 50) {
          nodes {
            id
            product {
              id
              handle
              title
              featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } }
              variants(first: 1) { nodes { id availableForSale } }
            }
          }
        }
      }
    }
  }
`;

export const CUSTOMER_WISHLIST_ADD_MUTATION = `#graphql
  mutation CustomerWishlistAddItem($productId: ID!) {
    customerWishlistAddItem(productId: $productId) {
      wishlist { id }
      userErrors { field message }
    }
  }
`;

export const CUSTOMER_WISHLIST_REMOVE_MUTATION = `#graphql
  mutation CustomerWishlistRemoveItem($productId: ID!) {
    customerWishlistRemoveItem(productId: $productId) {
      wishlist { id }
      userErrors { field message }
    }
  }
`;
