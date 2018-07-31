const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const typeDefs = gql`
    type Query {
        user(id: String): User 
        users: [User]
        companies: [Company]
        company(id: String): Company
    }

    type Company{
        id: String,
        name: String,
        desc: String
        users: [User]
    }

    type User{
        id: String,
        firstName: String,
        age: Int
        company: Company
    }

`;

const resolvers = {
    Query: {
        users: () => {
            return axios.get("http://localhost:3000/users")
                .then(resp => resp.data);
        },
        user: (root, args ) => {
            return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
        },
        companies: () => {
            return axios.get("http://localhost:3000/companies")
                .then(resp => resp.data);
        },
        company: (root, args ) => {
            return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data);
        }
    },
    User:{
        company(user){
            return axios.get(`http://localhost:3000/companies/${user.companyId}`)
                .then(resp => resp.data);
        }
    },
    Company:{
        users(company){
            return axios.get(`http://localhost:3000/companies/${company.id}/users`)
                .then(resp => resp.data);
        }
    }
}

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    /*
    playground: {
        settings: {
            'editor.theme': 'light',
        }
    }
    */
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});