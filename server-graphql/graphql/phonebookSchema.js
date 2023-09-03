const { buildSchema } = require("graphql")
const phonebook = require("../models/Phonebook")

const schema = buildSchema(`
input PhonebookInput{
    name: String
    phone: String
}

input AvatarInput{
    avatar: String
}

type Phonebook {
    _id: ID!
    name: String
    phone: String
    avatar: String
}

type Query {
    getPhonebooks(
        sortby: String
        sort: String
        page: Int
        limit: Int
        keyword: String
        ): [Phonebook]
    getPhonebook(id: ID!): Phonebook
}

type Mutation {
    createPhonebook(input: PhonebookInput): Phonebook
    updatePhonebook(id: ID!, input: PhonebookInput): Phonebook
    updateAvatar(id: ID!, input: AvatarInput): Phonebook
    deletePhonebook(id: ID!): Phonebook
}
`)

const solution = {
    getPhonebooks: ({ page = 1, limit = 13, sortby = "name", sort = "asc", keyword = "" }) => {
        const skip = (page - 1) * limit
        let query = phonebook.find({})
        if (sortby && sort) {
            query = query.sort({ [sortby]: sort });
        }

        query = query.skip(skip).limit(limit);

        if (keyword) {
            query = query.find({ name: { $regex: keyword, $options: 'i' } });
        }

        const results = query.exec();
        return results;
    },
    getPhonebook: ({ id }) => phonebook.findById(id),
    createPhonebook: ({ input }) => phonebook.create(input),
    updatePhonebook: ({ id, input }) => phonebook.findByIdAndUpdate(id, input, { new: true }),
    updateAvatar: ({ id, input }) => phonebook.findByIdAndUpdate(id, input, { new: true }),
    deletePhonebook: ({ id }) => phonebook.findByIdAndRemove(id)
}

module.exports = { schema, solution }