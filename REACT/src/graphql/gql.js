import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
 query GetContacts {
     getContacts {
       _id
       name
       phone
       avatar
     }
   }
`;

export const CREATE_CONTACT = gql`
mutation CreateContact($name: String!, $phone: String!) {
    createContact(input: { name: $name, phone: $phone }) {
        _id
        name
        phone
        avatar
    }
}
`;

