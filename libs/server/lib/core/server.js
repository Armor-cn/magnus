"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const language_1 = require("graphql/language");
const compile_1 = require("./compiler/compile");
const resolver_1 = require("./compiler/resolver");
const lodash_1 = require("lodash");
class CoreServer {
    constructor(_options, _connection, _server) {
        this._options = _options;
        this._connection = _connection;
        this._server = _server;
        this.resolver = [];
    }
    async init() {
        this._connection = await typeorm_1.createConnection(this._options);
        const entities = this._options.entities || [];
        entities.map(entity => {
            if (this._connection) {
                const meta = this._connection.getMetadata(entity);
                const res = this._connection.getRepository(meta.target);
                this.resolver.push(new resolver_1.Resolver(res, meta.name));
            }
        });
        const resolvers = this.createResolvers();
        const config = {
            typeDefs: compile_1.compile(this._connection, this._options.entities),
            resolvers,
            playground: true,
        };
        this._server = new apollo_server_express_1.ApolloServer(config);
        return this._server;
    }
    createMutation() {
        const options = {};
        this.resolver.map(res => {
            const mutation = res.getMutation();
            options[`${res.name}`] = () => mutation;
            Object.keys(mutation).map(key => {
                options[`${lodash_1.lowerFirst(res.name)}${lodash_1.upperFirst(key)}`] = mutation[`${key}`];
            });
        });
        return options;
    }
    createQuery() {
        const options = {};
        this.resolver.map(res => {
            const query = res.getQuery();
            options[`${res.name}`] = query;
            Object.keys(query).map(key => {
                options[`${lodash_1.lowerFirst(res.name)}${lodash_1.upperFirst(key)}`] = query[`${key}`];
            });
        });
        return options;
    }
    createSubscription() {
        const options = {};
        this.resolver.map(res => {
            const query = res.getSubscribtion();
            options[`${res.name}`] = () => query;
            Object.keys(query).map(key => {
                options[`${lodash_1.lowerFirst(res.name)}${lodash_1.upperFirst(key)}`] = query[`${key}`];
            });
        });
        return options;
    }
    createResolvers() {
        return {
            Query: this.createQuery(),
            Mutation: this.createMutation(),
            Subscription: this.createSubscription(),
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
