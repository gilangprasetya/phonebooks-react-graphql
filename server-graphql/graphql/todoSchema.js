const { buildSchema } = require("graphql")
const Todo = require("../models/Todo")

const schema = buildSchema(`
input TodoInput{
    title: String
    complete: Boolean
}

type Todo {
    _id: ID!
    title: String
    complete: Boolean
}

type Query {
    getTodos: [Todo]
    getTodo(id: ID!): Todo
}

type Mutation {
    createTodo(input: TodoInput): Todo
    updateTodo(id: ID!, input: TodoInput): Todo
    deleteTodo(id: ID!): Todo
}
`)

// class Todo {
//     constructor(_id, { title, complete }) {
//         this._id = _id
//         this.title = title
//         this.complete = complete
//     }
// }

const solution = {
    getTodos: () => Todo.find(),
    getTodo: ({ id }) => Todo.findById(id),
    createTodo: ({ input }) => Todo.create(input),
    updateTodo: ({ id, input }) => Todo.findByIdAndUpdate(id, input, { new: true }),
    deleteTodo: ({ id }) => Todo.findByIdAndRemove(id)
}

module.exports = { schema, solution }