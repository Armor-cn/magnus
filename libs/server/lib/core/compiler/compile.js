"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("./compiler");
const parse_1 = require("./parse");
const apollo_server_1 = require("apollo-server");
function compile(connection, entities) {
    const metadatas = connection.entityMetadatas;
    const visitor = new parse_1.ParseVisitor();
    const nodes = [];
    const compiler = new compiler_1.Compiler(connection, entities);
    const code = compiler.progress.visit(visitor, metadatas);
    nodes.push(apollo_server_1.gql `${code}`);
    return nodes;
}
exports.compile = compile;
