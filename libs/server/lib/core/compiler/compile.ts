import { Compiler } from './compiler'
import { Connection, ObjectType } from 'typeorm';
import { ParseVisitor } from './parse';
import { DocumentNode } from 'graphql';
import { gql } from 'apollo-server';
import { writeFileSync } from 'fs-extra'
import { join } from 'path'
export function compile(connection: Connection, entities: ObjectType<any>[]): DocumentNode[] {
    const metadatas = connection.entityMetadatas;
    const visitor = new ParseVisitor();
    const nodes: DocumentNode[] = [];
    const compiler = new Compiler(connection, entities);
    const code = compiler.progress.visit(visitor, metadatas);
    writeFileSync(join(__dirname, 'main.graphql'), code)
    nodes.push(gql`${code}`);
    return nodes;
}
