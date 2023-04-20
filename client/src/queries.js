import gql from 'graphql-tag';

export const CLIENTS_LIST_QUERY = gql`
  query clientsList {
    allClients {
      name
      company_number
      street
      city
      postcode
      country_code
      tax_number
      vat_number
      email
      phone
      web
      invoices_count
    }
  }
`;
