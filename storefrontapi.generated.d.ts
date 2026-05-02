/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
  promoA?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  promoB?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
    promoA?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
    promoB?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type HomePageQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type HomePageQuery = {
  heroSlides: {
    nodes: Array<{
      image?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText'>
          >;
        }>;
      }>;
      title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
      subtitle?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MetaobjectField, 'value'>
      >;
      tag?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    }>;
  };
  blog?: StorefrontAPI.Maybe<{
    articles: {
      nodes: Array<
        Pick<
          StorefrontAPI.Article,
          'id' | 'title' | 'handle' | 'excerpt' | 'publishedAt'
        > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText'>
          >;
        }
      >;
    };
  }>;
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        images: {nodes: Array<Pick<StorefrontAPI.Image, 'url' | 'altText'>>};
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
          >;
        };
      }
    >;
  };
};

export type CustomerUpdateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  customer: StorefrontAPI.CustomerUpdateInput;
}>;

export type CustomerUpdateMutation = {
  customerUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Customer, 'id' | 'firstName' | 'lastName' | 'email'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressCreateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  address: StorefrontAPI.MailingAddressInput;
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressUpdateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  id: StorefrontAPI.Scalars['ID']['input'];
  address: StorefrontAPI.MailingAddressInput;
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  id: StorefrontAPI.Scalars['ID']['input'];
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: StorefrontAPI.Maybe<{
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressesQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerAddressesQuery = {
  customer?: StorefrontAPI.Maybe<{
    defaultAddress?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'address1'
        | 'address2'
        | 'city'
        | 'province'
        | 'zip'
        | 'country'
        | 'phone'
      >
    >;
    addresses: {
      nodes: Array<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'address1'
          | 'address2'
          | 'city'
          | 'province'
          | 'zip'
          | 'country'
          | 'phone'
        >
      >;
    };
  }>;
};

export type CustomerAccessTokenCreateMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerAccessTokenCreateInput;
}>;

export type CustomerAccessTokenCreateMutation = {
  customerAccessTokenCreate?: StorefrontAPI.Maybe<{
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerCreateMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerCreateInput;
}>;

export type CustomerCreateMutation = {
  customerCreate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Customer, 'id' | 'firstName' | 'lastName' | 'email'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerOrdersDetailQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerOrdersDetailQuery = {
  customer?: StorefrontAPI.Maybe<{
    orders: {
      nodes: Array<
        Pick<
          StorefrontAPI.Order,
          'id' | 'name' | 'processedAt' | 'fulfillmentStatus'
        > & {
          totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          lineItems: {
            nodes: Array<
              Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
                originalTotalPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                variant?: StorefrontAPI.Maybe<{
                  image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
                }>;
              }
            >;
          };
        }
      >;
    };
  }>;
};

export type CustomerOrdersQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerOrdersQuery = {
  customer?: StorefrontAPI.Maybe<{
    orders: {
      nodes: Array<
        Pick<
          StorefrontAPI.Order,
          'id' | 'name' | 'processedAt' | 'fulfillmentStatus'
        > & {
          totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          lineItems: {
            nodes: Array<
              Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
                originalTotalPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                variant?: StorefrontAPI.Maybe<{
                  image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
                }>;
              }
            >;
          };
        }
      >;
    };
  }>;
};

export type CustomerQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerQuery = {
  customer?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Customer,
      'id' | 'firstName' | 'lastName' | 'email' | 'displayName'
    > & {
      orders: {
        nodes: Array<
          Pick<
            StorefrontAPI.Order,
            'id' | 'name' | 'processedAt' | 'fulfillmentStatus'
          > & {
            totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          }
        >;
      };
      defaultAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'address1'
          | 'address2'
          | 'city'
          | 'province'
          | 'zip'
          | 'country'
          | 'phone'
        >
      >;
      addresses: {
        nodes: Array<
          Pick<
            StorefrontAPI.MailingAddress,
            | 'id'
            | 'address1'
            | 'address2'
            | 'city'
            | 'province'
            | 'zip'
            | 'country'
            | 'phone'
          >
        >;
      };
    }
  >;
};

export type BlogDetailQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type BlogDetailQuery = {
  blog?: StorefrontAPI.Maybe<{
    articleByHandle?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Article,
        | 'id'
        | 'title'
        | 'handle'
        | 'excerpt'
        | 'contentHtml'
        | 'publishedAt'
        | 'tags'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  }>;
};

export type BlogIndexQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type BlogIndexQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title'> & {
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            | 'id'
            | 'title'
            | 'handle'
            | 'excerpt'
            | 'contentHtml'
            | 'publishedAt'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
          }
        >;
      };
    }
  >;
};

export type CollectionByHandleQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type CollectionByHandleQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'title' | 'description'> & {
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
            images: {
              nodes: Array<Pick<StorefrontAPI.Image, 'url' | 'altText'>>;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
          }
        >;
      };
    }
  >;
};

export type CollectionsIndexQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type CollectionsIndexQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  };
};

export type PageByHandleQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageByHandleQuery = {
  page?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Page, 'id' | 'title' | 'body'>>;
};

export type PoliciesIndexQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesIndexQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle' | 'title' | 'body'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle' | 'title' | 'body'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle' | 'title' | 'body'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle' | 'title' | 'body'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'handle' | 'title' | 'body'>
    >;
  };
};

export type ProductByHandleQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductByHandleQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'description' | 'descriptionHtml' | 'productType'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
      >;
      images: {
        nodes: Array<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      };
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      semina_semenzaio?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      semina_aperto?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      semina_raccolta?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      difficolta?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      tempo_raccolto?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      germinazione?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      esposizione?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      tipologia?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      consiglio_esperto?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      codice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'quantityAvailable'
          > & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }
        >;
      };
    }
  >;
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'id'>>};
      }
    >
  >;
};

export type SearchResultsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  query: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type SearchResultsQuery = {
  search: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type SitemapDataQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SitemapDataQuery = {
  products: {nodes: Array<Pick<StorefrontAPI.Product, 'handle'>>};
  collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
  pages: {nodes: Array<Pick<StorefrontAPI.Page, 'handle'>>};
};

export type SmartGardenProductsQueryVariables = StorefrontAPI.Exact<{
  query: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type SmartGardenProductsQuery = {
  search: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'description' | 'productType'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'id'>>};
        semina_semenzaio?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        semina_aperto?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        semina_raccolta?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
      }
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n    promoA: metafield(namespace: "custom", key: "promo_text_a") { value }\n    promoB: metafield(namespace: "custom", key: "promo_text_b") { value }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query HomePage(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int!\n  ) @inContext(country: $country, language: $language) {\n    heroSlides: metaobjects(type: "hero_slide", first: 10) {\n      nodes {\n        image: field(key: "image") { reference { ... on MediaImage { image { url altText } } } }\n        title: field(key: "title") { value }\n        subtitle: field(key: "subtitle") { value }\n        tag: field(key: "tag") { value }\n      }\n    }\n    blog(handle: "journal") {\n      articles(first: 3) {\n        nodes {\n          id title handle excerpt publishedAt\n          image { url altText }\n        }\n      }\n    }\n    products(first: $first, sortKey: BEST_SELLING) {\n      nodes {\n        id\n        handle\n        title\n        featuredImage {\n          url\n          altText\n        }\n        images(first: 2) {\n          nodes {\n            url\n            altText\n          }\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        variants(first: 1) {\n          nodes {\n            id\n            availableForSale\n          }\n        }\n      }\n    }\n  }\n': {
    return: HomePageQuery;
    variables: HomePageQueryVariables;
  };
  '#graphql\n    query CustomerAddresses($customerAccessToken: String!) {\n      customer(customerAccessToken: $customerAccessToken) {\n        defaultAddress { id address1 address2 city province zip country phone }\n        addresses(first: 10) {\n          nodes { id address1 address2 city province zip country phone }\n        }\n      }\n    }\n  ': {
    return: CustomerAddressesQuery;
    variables: CustomerAddressesQueryVariables;
  };
  '#graphql\n  query CustomerOrdersDetail($customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      orders(first: 50) {\n        nodes {\n          id\n          name\n          processedAt\n          totalPrice { amount currencyCode }\n          fulfillmentStatus\n          lineItems(first: 20) {\n            nodes {\n              title\n              quantity\n              originalTotalPrice { amount currencyCode }\n              variant { image { url } }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: CustomerOrdersDetailQuery;
    variables: CustomerOrdersDetailQueryVariables;
  };
  '#graphql\n  query CustomerOrders($customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      orders(first: 50) {\n        nodes {\n          id\n          name\n          processedAt\n          totalPrice { amount currencyCode }\n          fulfillmentStatus\n          lineItems(first: 10) {\n            nodes {\n              title\n              quantity\n              originalTotalPrice { amount currencyCode }\n              variant { image { url } }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
  '#graphql\n  query Customer($customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      id\n      firstName\n      lastName\n      email\n      displayName\n      orders(first: 5) {\n        nodes {\n          id\n          name\n          processedAt\n          totalPrice { amount currencyCode }\n          fulfillmentStatus\n        }\n      }\n      defaultAddress { id address1 address2 city province zip country phone }\n      addresses(first: 10) {\n        nodes { id address1 address2 city province zip country phone }\n      }\n    }\n  }\n': {
    return: CustomerQuery;
    variables: CustomerQueryVariables;
  };
  '#graphql\n  query BlogDetail(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    blog(handle: "journal") {\n      articleByHandle(handle: $handle) {\n        id\n        title\n        handle\n        excerpt\n        contentHtml\n        publishedAt\n        image { url altText }\n        tags\n      }\n    }\n  }\n': {
    return: BlogDetailQuery;
    variables: BlogDetailQueryVariables;
  };
  '#graphql\n  query BlogIndex(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    blog(handle: "journal") {\n      title\n      articles(first: 12) {\n        nodes {\n          id\n          title\n          handle\n          excerpt\n          contentHtml\n          publishedAt\n          image { url altText }\n        }\n      }\n    }\n  }\n': {
    return: BlogIndexQuery;
    variables: BlogIndexQueryVariables;
  };
  '#graphql\n  query CollectionByHandle(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n    $first: Int!\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      title\n      description\n      products(first: $first) {\n        nodes {\n          id\n          handle\n          title\n          featuredImage {\n            url\n            altText\n          }\n          images(first: 2) {\n            nodes {\n              url\n              altText\n            }\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          variants(first: 1) {\n            nodes {\n              id\n              availableForSale\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: CollectionByHandleQuery;
    variables: CollectionByHandleQueryVariables;
  };
  '#graphql\n  query CollectionsIndex($country: CountryCode, $language: LanguageCode, $first: Int!)\n  @inContext(country: $country, language: $language) {\n    collections(first: $first) {\n      nodes {\n        id\n        handle\n        title\n        image {\n          url\n          altText\n        }\n      }\n    }\n  }\n': {
    return: CollectionsIndexQuery;
    variables: CollectionsIndexQueryVariables;
  };
  '#graphql\n  query PageByHandle(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    page(handle: $handle) {\n      id\n      title\n      body\n    }\n  }\n': {
    return: PageByHandleQuery;
    variables: PageByHandleQueryVariables;
  };
  '#graphql\n  query PoliciesIndex($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        handle\n        title\n        body\n      }\n      refundPolicy {\n        handle\n        title\n        body\n      }\n      shippingPolicy {\n        handle\n        title\n        body\n      }\n      termsOfService {\n        handle\n        title\n        body\n      }\n      subscriptionPolicy {\n        handle\n        title\n        body\n      }\n    }\n  }\n': {
    return: PoliciesIndexQuery;
    variables: PoliciesIndexQueryVariables;
  };
  '#graphql\n  query ProductByHandle(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      descriptionHtml\n      productType\n      featuredImage { url altText width height }\n      images(first: 6) { nodes { url altText width height } }\n      options { name values }\n      semina_semenzaio: metafield(namespace: "custom", key: "semina_semenzaio") { value }\n      semina_aperto: metafield(namespace: "custom", key: "semina_aperto") { value }\n      semina_raccolta: metafield(namespace: "custom", key: "semina_raccolta") { value }\n      difficolta: metafield(namespace: "custom", key: "difficolta") { value }\n      tempo_raccolto: metafield(namespace: "custom", key: "tempo_raccolto") { value }\n      germinazione: metafield(namespace: "custom", key: "germinazione") { value }\n      esposizione: metafield(namespace: "custom", key: "esposizione") { value }\n      tipologia: metafield(namespace: "custom", key: "tipologia") { value }\n      consiglio_esperto: metafield(namespace: "custom", key: "consiglio_esperto") { value }\n      codice: metafield(namespace: "custom", key: "codice") { value }\n      variants(first: 100) {\n        nodes {\n          id\n          availableForSale\n          quantityAvailable\n          selectedOptions { name value }\n          price { amount currencyCode }\n          compareAtPrice { amount currencyCode }\n          image { url altText width height }\n        }\n      }\n    }\n  }\n': {
    return: ProductByHandleQuery;
    variables: ProductByHandleQueryVariables;
  };
  '#graphql\n  query ProductRecommendations(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    productRecommendations(productHandle: $handle) {\n      id\n      handle\n      title\n      featuredImage { url altText }\n      priceRange { minVariantPrice { amount currencyCode } }\n      variants(first: 1) { nodes { id } }\n    }\n  }\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query SearchResults(\n    $country: CountryCode\n    $language: LanguageCode\n    $query: String!\n    $first: Int!\n  ) @inContext(country: $country, language: $language) {\n    search(query: $query, first: $first, types: [PRODUCT]) {\n      nodes {\n        ... on Product {\n          id\n          handle\n          title\n          featuredImage {\n            url\n            altText\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: SearchResultsQuery;
    variables: SearchResultsQueryVariables;
  };
  '#graphql\n  query SitemapData($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    products(first: 250) {\n      nodes { handle }\n    }\n    collections(first: 250) {\n      nodes { handle }\n    }\n    pages(first: 250) {\n      nodes { handle }\n    }\n  }\n': {
    return: SitemapDataQuery;
    variables: SitemapDataQueryVariables;
  };
  '#graphql\n  query SmartGardenProducts($query: String!, $first: Int!)\n  @inContext(country: IT, language: IT) {\n    search(query: $query, first: $first, types: [PRODUCT]) {\n      nodes {\n        ... on Product {\n          id\n          title\n          handle\n          description\n          productType\n          featuredImage { url altText }\n          priceRange { minVariantPrice { amount currencyCode } }\n          variants(first: 1) { nodes { id } }\n          semina_semenzaio: metafield(namespace: "custom", key: "semina_semenzaio") { value }\n          semina_aperto: metafield(namespace: "custom", key: "semina_aperto") { value }\n          semina_raccolta: metafield(namespace: "custom", key: "semina_raccolta") { value }\n        }\n      }\n    }\n  }\n': {
    return: SmartGardenProductsQuery;
    variables: SmartGardenProductsQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {\n    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {\n      customer { id firstName lastName email }\n      customerUserErrors { code field message }\n    }\n  }\n': {
    return: CustomerUpdateMutation;
    variables: CustomerUpdateMutationVariables;
  };
  '#graphql\n  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {\n    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {\n      customerAddress { id }\n      customerUserErrors { code field message }\n    }\n  }\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {\n    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {\n      customerAddress { id }\n      customerUserErrors { code field message }\n    }\n  }\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {\n    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {\n      customerUserErrors { code field message }\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {\n    customerAccessTokenCreate(input: $input) {\n      customerAccessToken { accessToken expiresAt }\n      customerUserErrors { code field message }\n    }\n  }\n': {
    return: CustomerAccessTokenCreateMutation;
    variables: CustomerAccessTokenCreateMutationVariables;
  };
  '#graphql\n  mutation CustomerCreate($input: CustomerCreateInput!) {\n    customerCreate(input: $input) {\n      customer { id firstName lastName email }\n      customerUserErrors { code field message }\n    }\n  }\n': {
    return: CustomerCreateMutation;
    variables: CustomerCreateMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
