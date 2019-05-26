import { CoreServer } from './core/server'
import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';
import { gql } from 'apollo-server';
import { readFileSync } from 'fs-extra';
import { join } from 'path'
import { ObjectType, ObjectID, FindConditions, FindManyOptions } from 'typeorm'
const books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];
export class MagnusServer extends CoreServer {
    createQuery() {
        let options = {};
        if (this._options.entities) {
            this._options.entities.map(type => {
                if (typeof type === 'string') {
                    // path
                } else if (typeof type === 'function') {
                    options = {
                        ...options,
                        ...this.createQueryByEntity(type)
                    }
                } else {
                    // schema
                }
            })
        }
        return options;
    }
    createQueryByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            const repository = this._connection.getRepository(entity);
            return {
                find: <Entity>(options?: FindManyOptions<Entity>) => repository.find(options),
                count: <Entity>(options?: FindManyOptions<Entity>) => repository.count(options),
                delete: <Entity>(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>) => repository.delete(criteria),
            }
        }
    }
    createMutation(entity: ObjectType<any>) { }
    createSubscription(entity: ObjectType<any>) { }
    createResolvers(): IResolvers {
        return {
            Query: {
                books: () => books,
            },
            Mutation: {},
            Subscription: {}
        }
    }
    createTypeDefs(): DocumentNode | Array<DocumentNode> {
        const graphql = readFileSync(join(__dirname, 'main.graphql'))
        return gql`${graphql}`;
    }
}