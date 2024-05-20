import gql from 'graphql-tag';

export const CLIENT_QUERY = gql`
  query client($id: ID!) {
    Client(id: $id) {
      city
      company_number
      country_code
      email
      id
      invoices_count
      name
      phone
      postcode
      street
      tax_number
      vat_number
      web
    }
  }
`;

export const CLIENTS_LIST_QUERY = gql`
  query clientsList($sortField: String, $filter: ClientFilter, $perPage: Int, $page: Int) {
    allClients(sortField: $sortField, filter: $filter, perPage: $perPage, page: $page) {
      city
      company_number
      country_code
      email
      id
      invoices_count
      name
      phone
      postcode
      street
      tax_number
      vat_number
      web
    }
  }
`;

export const COMPANIES_LIST_QUERY = gql`
  query companyList($sortField: String, $filter: CompanyInfoFilter, $perPage: Int, $page: Int) {
    allCompanyInfos(sortField: $sortField, filter: $filter, perPage: $perPage, page: $page) {
      id
      company_number
      name
      country_code
      address_street
      address_city
      address_postcode
      vat_no
      reg_no
      phone
      email
      mobile
      bank_account
      web
    }
  }
`;

export const ALL_CLIENTS_LIST_META_QUERY = gql`
  query allClientsListMeta($filter: ClientFilter, $perPage: Int, $page: Int) {
    _allClientsMeta(filter: $filter, perPage: $perPage, page: $page) {
      count
    }
  }
`;
