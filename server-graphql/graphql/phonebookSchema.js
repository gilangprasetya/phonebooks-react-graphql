const { buildSchema } = require("graphql")
const phonebook = require("../models/Phonebook")

const schema = buildSchema(`
input ContactInput{
    name: String
    phone: String
}

input AvatarInput{
    avatar: String
}

type Contact {
    _id: ID!
    name: String
    phone: String
    avatar: String
}

type Query {
    getContacts(page: Int): [Contact]
    getContact(id: ID!): Contact
}

type Mutation {
    createContact(input: ContactInput): Contact
    updateContact(id: ID!, input: ContactInput): Contact
    updateAvatar(id: ID!, input: AvatarInput): Contact
    deleteContact(id: ID!): Contact
}
`)

// class Contact {
//     constructor(_id, { name, phone }) {
//         this._id = _id
//         this.name = name
//         this.phone = phone
//     }
// }

const solution = {
    getContacts: ({ page = 1 }) => {
        const limit = 100
        const offset = (page - 1) * limit
        return phonebook.find({}).sort({ name: "asc" }).limit(limit).skip(offset)
    },
    getContact: ({ id }) => phonebook.findById(id),
    createContact: ({ input }) => phonebook.create(input),
    updateContact: ({ id, input }) => phonebook.findByIdAndUpdate(id, input, { new: true }),
    updateAvatar: ({ id, input }) => phonebook.findByIdAndUpdate(id, input, { new: true }),
    deleteContact: ({ id }) => phonebook.findByIdAndRemove(id)
}

module.exports = { schema, solution }

// query getAllContacts {
//     getContacts {
//       _id
//       name
//       phone
//       avatar
//     }
//   }
  
//   query getContactsByPage($page: Int) {
//     getContacts(page: $page) {
//       _id
//       name
//       phone
//       avatar
//     }
//   }
  
//   mutation createContact($name: String!, $phone: String!) {
//     createContact(input: {name: $name, phone: $phone}) {
//       _id
//       name
//       phone
//       avatar
//     }
//   }
  
//   mutation updateContact($id: ID!, $name:String!, $phone: String!) {
//     updateContact(id: $id, input: {name: $name, phone: $phone}) {
//       _id
//       name
//       phone
//     }
//   }
  
//   mutation deleteContact($id: ID!) {
//     deleteContact(id: $id) {
//       _id
//       name
//       phone
//     }
//   }