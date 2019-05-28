import { Compiler } from './compiler'
import { Connection } from 'typeorm';
import { ParseVisitor } from './parse';
import { DocumentNode } from 'graphql';
import { gql } from 'apollo-server';
import { writeFileSync } from 'fs-extra';
import { join } from 'path';
export function compile(connection: Connection): DocumentNode[] {
    const metadatas = connection.entityMetadatas;
    const visitor = new ParseVisitor();
    const nodes: DocumentNode[] = [];
    metadatas.map(meta => {
        const compiler = new Compiler(meta);
        const code = compiler.document.visit(visitor, meta);
        writeFileSync(join(__dirname, `${meta.name}.graphql`), code)
        nodes.push(gql`${code}`);
    });
    return nodes;
}