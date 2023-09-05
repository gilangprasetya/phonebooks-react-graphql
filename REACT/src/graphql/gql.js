import { gql } from "@apollo/client";

export const GET_PHONEBOOKS = gql`
query getPhonebooks($sort: String, $sortby: String, $page: Int, $limit: Int, $keyword: String) {
    getPhonebooks(sort: $sort, sortby: $sortby, page: $page, limit: $limit, keyword: $keyword) {
      _id
      name
      phone
      avatar
    }
  }  
`;

export const CREATE_PHONEBOOK = gql`
mutation CreatePhonebook($name: String!, $phone: String!) {
    createPhonebook(input: { name: $name, phone: $phone }) {
        _id
        name
        phone
        avatar
        }
    }
`;

export const UPDATE_PHONEBOOK = gql`
mutation UpdatePhonebook($id: ID!, $name: String!, $phone: String!) {
    updatePhonebook(id: $id, input: { name: $name, phone: $phone }) {
        _id
        name
        phone
        avatar
        }
    }
`;

export const UPDATE_AVATAR = gql`
  mutation updateAvatar($id: ID!, $avatar: String!) {
    updateAvatar(id: $id, input: { avatar: $avatar }) {
      _id
      name
      phone
      avatar
    }
  }
`;

export const DELETE_PHONEBOOK = gql`
  mutation deletePhonebook($id: ID!) {
    deletePhonebook(id: $id) {
      _id
      name
      phone
      avatar
    }
  }
`;