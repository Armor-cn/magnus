import { CoreServer } from './core/server'
import { ObjectType, ObjectID, FindConditions, FindManyOptions } from 'typeorm'
export class MagnusServer extends CoreServer {
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
    createMutationByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            const repository = this._connection.getRepository(entity);
            return {}
        }
    }
    createSubscriptionByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            return {}
        }
    }
}