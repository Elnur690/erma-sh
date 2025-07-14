import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int = 20, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        description
        shortDescription
        image {
          id
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        reviewCount
        averageRating
        onSale
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $first: Int = 10) {
    products(first: $first, where: { search: $search }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      image {
        id
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          id
          sourceUrl
          altText
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockQuantity
        stockStatus
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockQuantity
        stockStatus
        variations {
          nodes {
            id
            name
            price
            regularPrice
            salePrice
            stockQuantity
          }
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      related {
        nodes {
          id
          name
          slug
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
          }
        }
      }
      reviewCount
      averageRating
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories {
      nodes {
        id
        name
        slug
        description
        image {
          sourceUrl
          altText
        }
        children {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

// Note: These mutations are not available in the current GraphQL API
// We're using REST API endpoints for authentication instead

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders {
    customer {
      orders {
        nodes {
          id
          orderNumber
          date
          status
          total
          lineItems {
            nodes {
              product {
                node {
                  name
                }
              }
              quantity
              total
            }
          }
        }
      }
    }
  }
`;

export const GET_WISHLIST = gql`
  query GetWishlist {
    customer {
      wishlist {
        products {
          nodes {
            id
            name
            slug
            image {
              sourceUrl
              altText
            }
            ... on SimpleProduct {
              price
              regularPrice
              salePrice
            }
          }
        }
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(input: { productId: $productId }) {
      success
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(input: { productId: $productId }) {
      success
    }
  }
`;

export const SUBSCRIBE_NEWSLETTER = gql`
  mutation SubscribeNewsletter($email: String!) {
    subscribeNewsletter(input: { email: $email }) {
      success
      message
    }
  }
`;

export const SEND_CONTACT_MESSAGE = gql`
  mutation SendContactMessage($name: String!, $email: String!, $subject: String!, $message: String!) {
    sendContactMessage(input: { name: $name, email: $email, subject: $subject, message: $message }) {
      success
      message
    }
  }
`;

export const GET_SOCIAL_SHARE_URLS = gql`
  query GetSocialShareUrls($productId: ID!) {
    product(id: $productId) {
      shareUrls {
        facebook
        twitter
        whatsapp
        messenger
      }
    }
  }
`;

export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings {
    siteSettings {
      socialMedia {
        facebook
        instagram
        twitter
        youtube
        whatsapp
        messenger
      }
      seo {
        defaultTitle
        defaultDescription
        keywords
      }
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentGateways {
      id
      title
      description
      enabled
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    checkout(input: $input) {
      order {
        id
        orderNumber
        total
        status
      }
      paymentUrl
    }
  }
`;

export const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses {
    customer {
      shipping {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        phone
      }
      billing {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        phone
      }
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        id
        shipping {
          firstName
          lastName
          company
          address1
          address2
          city
          state
          postcode
          country
          phone
        }
        billing {
          firstName
          lastName
          company
          address1
          address2
          city
          state
          postcode
          country
          phone
        }
      }
    }
  }
`;
