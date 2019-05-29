"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const language_1 = require("graphql/language");
const compile_1 = require("./compiler/compile");
const resolver_1 = require("./compiler/resolver");
class CoreServer {
    constructor(_options, _connection, _server) {
        this._options = _options;
        this._connection = _connection;
        this._server = _server;
        this.resolver = [];
    }
    async init() {
        this._connection = await typeorm_1.createConnection(this._options);
        const metadatas = this._connection.entityMetadatas;
        metadatas.map(meta => {
            if (this._connection) {
                const res = this._connection.getRepository(meta.target);
                this.resolver.push(new resolver_1.Resolver(res, meta.name));
            }
        });
        const config = {
            typeDefs: compile_1.compile(this._connection),
            resolvers: {
                ...this.createResolvers()
            },
            playground: true,
        };
        this._server = new apollo_server_express_1.ApolloServer(config);
        return this._server;
    }
    createMutation() {
        const options = {};
        this.resolver.map(res => {
            options[`${res.name}`] = (...args) => {
                return res.getMutation();
            };
        });
        return options;
    }
    createQuery() {
        const options = {};
        this.resolver.map(res => {
            options[`${res.name}`] = () => res.getQuery();
        });
        return options;
    }
    createSubscription() {
        const options = {};
        this.resolver.map(res => {
            options[`${res.name}`] = () => res.getSubscribtion();
        });
        return options;
    }
    createResolvers() {
        return {
            Query: this.createQuery(),
            Mutation: this.createMutation(),
            ObjectLiteral: new graphql_1.GraphQLScalarType({
                name: 'ObjectLiteral',
                parseValue(value) {
                    return JSON.parse(value);
                },
                serialize(value) {
                    return JSON.stringify(value);
                },
                parseLiteral(ast) {
                    if (ast.kind === language_1.Kind.STRING) {
                        return JSON.parse(ast.value);
                    }
                    return null;
                }
            }),
            Date: new graphql_1.GraphQLScalarType({
                name: 'Date',
                parseValue(value) {
                    return new Date(value);
                },
                serialize(value) {
                    return value.getTime();
                },
                parseLiteral(ast) {
                    if (ast.kind === language_1.Kind.STRING) {
                        return new Date(ast.value);
                    }
                    return null;
                }
            })
        };
    }
}
exports.CoreServer = CoreServer;
