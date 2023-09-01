import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query getContacts($sort: String, $page: Int, $keyword: String) {
    Contacts(sort: $sort, page: $page, keyword: $keyword) {
      id
      name
      phone
      avatar
    }
    pages
  }
`;

export const CREATE_CONTACT = gql`
  mutation createContact($name: String!, $phone: String!) {
    createContact(input: { name: $name, phone: $phone }) {
      id
      name
      phone
      avatar
    }
  }
`;