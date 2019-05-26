import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, ObjectID, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CoreServer } from './core/server';
export class MagnusServer extends CoreServer {
    createQueryByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            const repository = this._connection.getRepository(entity);
            return {
                hasId: <Entity>(entity: Entity) => repository.hasId(entity),
                getId: <Entity>(entity: Entity) => repository.getId(entity),
                find: <Entity>(tions?: FindManyOptions<Entity> | FindConditions<Entity>) => repository.find(tions),
                findAndCount: <Entity>(tions?: FindManyOptions<Entity> | FindConditions<Entity>) => repository.findAndCount(tions),
                count: <Entity>(tions?: FindManyOptions<Entity> | FindConditions<Entity>) => repository.count(tions),
                findByIds: <Entity>(ids: any[], tions?: FindManyOptions<Entity> | FindConditions<Entity>) => repository.findByIds(ids, tions),
                findOne: <Entity>(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>, conditions?: FindConditions<Entity>) => {
                    if (id) {
                        repository.findOne(id, options);
                    } else if (conditions) {
                        repository.findOne(conditions, options);
                    } else {
                        repository.findOne(options);
                    }

                },
                findOneOrFail: <Entity>(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>, conditions?: FindConditions<Entity>) => {
                    if (id) {
                        repository.findOneOrFail(id, options);
                    } else if (conditions) {
                        repository.findOneOrFail(conditions, options);
                    } else {
                        repository.findOneOrFail(options);
                    }
                },
                query: <Entity>(query: string, parameters?: any[]) => repository.query(query, parameters),





            }
        }
    }
    createMutationByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            const repository = this._connection.getRepository(entity);
            return {
                create: <Entity>(entityLike?: DeepPartial<Entity>) => {
                    if (entityLike) {
                        repository.create(entityLike);
                    } else {
                        repository.create();
                    }
                },
                merge: <Entity>(mergeIntoEntity: Entity, ...entityLikes: DeepPartial<Entity>[]) => repository.merge(mergeIntoEntity, ...entityLikes),
                preload: <Entity>(entityLike: DeepPartial<Entity>) => repository.preload(entityLike),
                save: <T, SaveOptions>(entities: T[], options: SaveOptions & {
                    reload: false;
                }) => repository.save(entities, options),
                remove: <Entity, RemoveOptions>(entity: Entity[] | Entity, options?: RemoveOptions) => repository.remove(entity, options),
                insert: <Entity>(entity: QueryDeepPartialEntity<Entity> | (QueryDeepPartialEntity<Entity>[])) => repository.insert(entity),
                update: <Entity>(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
                    partialEntity: QueryDeepPartialEntity<Entity>) => repository.update(criteria, partialEntity),
                delete: <Entity>(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>) => repository.delete(criteria),
                clear: () => repository.clear(),
                increment: <Entity>(conditions: FindConditions<Entity>, propertyPath: string, value: number | string) => repository.increment(conditions, propertyPath, value),
                decrement: <Entity>(conditions: FindConditions<Entity>, propertyPath: string, value: number | string) => repository.decrement(conditions, propertyPath, value),

            }
        }
    }
    createSubscriptionByEntity(entity: ObjectType<any>) {
        if (this._connection) {
            return {}
        }
    }
}