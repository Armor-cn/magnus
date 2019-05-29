import { Connection, ObjectType } from 'typeorm';
import { DocumentNode } from 'graphql';
export declare function compile(connection: Connection, entities: ObjectType<any>[]): DocumentNode[];
