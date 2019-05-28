import { Connection } from 'typeorm';
import { DocumentNode } from 'graphql';
export declare function compile(connection: Connection): DocumentNode[];
