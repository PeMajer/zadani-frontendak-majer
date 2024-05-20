import gql from 'graphql-tag';

const generateClientMutation = (action, includeId = false) => gql`
  mutation(
    ${includeId ? '$id: ID!' : ''}
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
  ) { ${action}Client(
        ${includeId ? 'id: $id' : ''}
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

export const CREATE_CLIENT = generateClientMutation('create');
export const UPDATE_CLIENT = generateClientMutation('update', true);

export const DELETE_CLIENT = gql`
  mutation($id: ID!) {
    removeClient(id: $id) {
      id
    }
  }
`;
