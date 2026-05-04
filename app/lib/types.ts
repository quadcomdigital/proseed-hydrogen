export interface ProductCardData {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  image?: {url: string; altText?: string};
  secondImage?: {url: string; altText?: string};
  badge?: string;
  variantId?: string;
  availableForSale?: boolean;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {url: string; altText?: string};
  priceRange?: {minVariantPrice: {amount: string; currencyCode: string}};
  images?: {nodes: {url: string; altText?: string}[]};
  variants?: {nodes: {id: string; availableForSale?: boolean}[]};
}

export interface ShopifyOrder {
  id: string;
  name: string;
  processedAt: string;
  totalPrice?: {amount: string; currencyCode: string};
  fulfillmentStatus?: string;
  financialStatus?: string;
  lineItems?: {nodes: ShopifyOrderItem[]};
}

export interface ShopifyOrderItem {
  title: string;
  quantity: number;
  originalTotalPrice?: {amount: string; currencyCode: string};
  variant?: {image?: {url: string}};
}

export interface ShopifyAddress {
  id: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  displayName?: string;
  orders?: {nodes: ShopifyOrder[]};
  defaultAddress?: ShopifyAddress;
  addresses?: {nodes: ShopifyAddress[]};
}
