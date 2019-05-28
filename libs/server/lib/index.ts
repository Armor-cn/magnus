import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, ObjectID, ObjectType, SaveOptions, RemoveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CoreServer } from './core/server';
export class MagnusServer extends CoreServer {
    createQueryByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            const repository = this._connection.getRepository(entity);
            return {
                find: repository.find.bind(repository),
                findAndCount: repository.findAndCount.bind(repository),
                count: repository.count.bind(repository),
                findByIds: repository.findByIds.bind(repository),
                findOne: repository.findOne.bind(repository),
                findOneOrFail: repository.findOneOrFail.bind(repository),
            }
        }
    }
    createMutationByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            const repository = this._connection.getRepository(entity);
            return {
                save: <T>(data: {
                    entities: T[],
                    options?: SaveOptions
                }) => {
                    repository.save(data.entities, data.options)
                },
                remove: repository.remove.bind(repository),
                insert: repository.insert.bind(repository),
                update: repository.update.bind(repository),
                delete: repository.delete.bind(repository),
            }
        }
    }
    createSubscriptionByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            return {
                watch: (where: any) => {
                    return {}
                }
            }
        }
    }
}