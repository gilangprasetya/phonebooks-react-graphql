import { gql } from "@apollo/client";

export const GET_PHONEBOOKS = gql`
    query getPhonebooks($sort: String, $page: Int, $keyword: String) {
        getPhonebooks(sort: $sort, page: $page, keyword: $keyword) {
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