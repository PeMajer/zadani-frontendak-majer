import gql from 'graphql-tag';

export const CREATE_CLIENT = gql`
  mutation(
    $name: String!
    $company_number: String!
    $street: String!
    $city: String!
    $postcode: String!
    $country_code: String!
    $tax_number: String!
    $vat_number: String!
    $email: String!
    $phone: String!
    $web: String!
    $invoices_count: Int!
  ) { createClient(
        name: $name
        company_number: $company_number
        street: $street
        city: $city
        postcode: $postcode
        country_code: $country_code
        tax_number: $tax_number
        vat_number: $vat_number
        email: $email
        phone: $phone
        web: $web
        invoices_count: $invoices_count) {
          name
        }
    }
`;

export const DELETE_CLIENT = gql`
  mutation($id: ID!) {
    removeClient(id: $id) {
      id
    }
  }
`;
