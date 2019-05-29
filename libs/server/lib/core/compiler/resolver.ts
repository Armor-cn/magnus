import { Repository, FindManyOptions, FindOneOptions, ObjectID, EntityMetadata, DeleteResult, FindConditions, InsertResult, RemoveOptions, SaveOptions, Connection } from 'typeorm';
export enum MutationType {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED'
}
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC'
}
export interface SaveInput<T> {
    data: T;
    options?: SaveOptions;
}
export interface SavesInput<T> {
    data: T[];
    options: SaveOptions;
}

export interface RemoveInput<T> {
    data: T;
    options?: RemoveOptions;
}
interface RemovesInput<T> {
    data: T[];
    options?: RemoveOptions;
}

export interface IUpdateResult {
    code: number;
    message: string;
}

export interface MultiResult<T> {
    data: T[];
}
export interface SignalResult<T> {
    data: T;
}

interface CountResultInput {
    count: number;
}
interface FindAndCountResultInput<T> {
    count: number;
    data: T[];
}
interface FindByIdsType<T> {
    ids: any[];
    options?: FindManyOptions<T>
}
interface FindOneType<T> {
    id?: string | number | Date | ObjectID;
    options?: FindOneOptions<T>
}
interface WatchInput {
    mutation_in: MutationType[];
}
import { PubSub } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql';
export type ArgsMethod<T = any> = [undefined, T, any, GraphQLResolveInfo];
export type ArgsProperty<T = any> = [T, any, GraphQLResolveInfo];
export type Args<T = any> = ArgsMethod<T> | ArgsProperty<T>;
export function isArgsMethod<T>(args: Args<T>): args is ArgsMethod<T> {
    return Array.isArray(args) && args.length === 4;
}
export function isArgsProperty<T>(args: Args<T>): args is ArgsProperty<T> {
    return Array.isArray(args) && args.length === 3;
}
export class Resolver<T> {
    pubsub: PubSub = new PubSub();
    constructor(public repository: Repository<T>, public meta: EntityMetadata, public connection: Connection) { }
    getQuery() {
        return {
            count: (...args: Args<{ options: FindManyOptions }>) => {
                if (isArgsMethod(args)) {
                    return this.count(args[1].options)
                } else {
                    return this.count(args[0].options)
                }
            },
            find: (...args: Args<{ options?: FindConditions<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.find(args[1].options);
                } else if (isArgsProperty(args)) {
                    return this.find(args[0].options);
                }
            },
            findAndCount: (...args: Args<{ conditions?: FindConditions<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.findAndCount(args[1].conditions)
                } else {
                    return this.findAndCount(args[0].conditions)
                }
            },
            findByIds: (...args: Args<{ options: FindByIdsType<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.findByIds(args[1].options)
                } else {
                    return this.findByIds(args[0].options)
                }
            },
            findOne: (...args: Args<{ options: FindOneOptions<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.findOne(args[1].options)
                } else if (isArgsProperty(args)) {
                    return this.findOne(args[0].options)
                }
            }
        }
    }
    getMutation() {
        return {
            save: (...args: Args<{ entity: T, option?: SaveOptions }>) => {
                if (isArgsMethod(args)) {
                    return this.save(args[1].entity, args[1].option)
                } else {
                    return this.save(args[0].entity, args[0].option)
                }
            },
            saves: (...args: Args<{ entities: T[], option?: SaveOptions }>) => {
                if (isArgsMethod(args)) {
                    return this.saves(args[1].entities, args[1].option)
                } else {
                    return this.saves(args[0].entities, args[0].option)
                }
            },
            remove: (...args: Args<{ entity: T, option?: RemoveOptions }>) => {
                if (isArgsMethod(args)) {
                    return this.remove(args[1].entity, args[1].option)
                } else {
                    return this.remove(args[0].entity, args[0].option)
                }
            },
            removes: (...args: Args<{ entities: T[], option?: RemoveOptions }>) => {
                if (isArgsMethod(args)) {
                    return this.removes(args[1].entities, args[1].option)
                } else {
                    return this.removes(args[0].entities, args[0].option)
                }
            },
            insert: (...args: Args<{ entity: T }>) => {
                if (isArgsMethod(args)) {
                    return this.insert(args[1].entity)
                } else {
                    return this.insert(args[0].entity)
                }
            },
            update: (...args: Args<{ where: FindConditions<T>, options: any }>) => {
                if (isArgsMethod(args)) {
                    return this.update(args[1].where, args[1].options)
                } else {
                    return this.update(args[0].where, args[0].options)
                }
            },
            delete: (...args: Args<{ where: FindConditions<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.delete(args[1].where)
                } else {
                    return this.delete(args[0].where)
                }
            }
        }
    }
    getSubscribtion() {
        return {
            watch: (...args: Args<{ watch: WatchInput }>) => {
                if (isArgsMethod(args)) {
                    return this.pubsub.asyncIterator(args[1].watch.mutation_in)
                } else {
                    return this.pubsub.asyncIterator(args[0].watch.mutation_in)
                }
            }
        }
    }
    async save(entity: T, options?: SaveOptions): Promise<T> {
        await Promise.all(this.meta.relations.map(async relation => {
            const propertyName = relation.propertyName;
            const type = relation.type;
            const repository = this.connection.getRepository(type)
            const data = (entity as any)[propertyName];
            if (!!relation.joinTableName && data) {
                return await repository.save(data);
            }
        }));
        const data = await this.repository.save(entity, options);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return data;
    }
    async saves(entities: T[], options?: SaveOptions): Promise<T[]> {
        return await Promise.all(entities.map(entity => this.save(entity, options)));
    }
    async remove(entity: T, options?: RemoveOptions): Promise<IUpdateResult> {
        const data = await this.repository.remove(entity, options);
        this.pubsub.publish(MutationType.DELETED, {
            watch: { data, action: MutationType.DELETED }
        });
        return { code: 0, message: 'success' };
    }
    async removes(entities: T[], options?: RemoveOptions): Promise<T[]> {
        return Promise.all(entities.map(entity => this.repository.remove(entity, options)))
    }
    async insert(entity: any): Promise<InsertResult> {
        await Promise.all(this.meta.relations.map(async relation => {
            const propertyName = relation.propertyName;
            const type = relation.type;
            const repository = this.connection.getRepository(type)
            const data = (entity as any)[propertyName];
            if (!!relation.joinTableName && data) {
                return await repository.save(data);
            }
        }));
        const data = await this.repository.insert(entity);
        this.pubsub.publish(MutationType.CREATED, {
            watch: { data, action: MutationType.CREATED }
        });
        return data;
    }
    async inserts(options: any[]): Promise<InsertResult> {
        return this.repository.insert(options)
    }
    async update(where: FindConditions<T>, entity: any): Promise<IUpdateResult> {
        await Promise.all(this.meta.relations.map(async relation => {
            const propertyName = relation.propertyName;
            const type = relation.type;
            const repository = this.connection.getRepository(type)
            const data = (entity as any)[propertyName];
            if (!!relation.joinTableName && data) {
                return await repository.save(data);
            }
        }));
        const data = await this.repository.update(where, entity);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return { code: 0, message: 'success' };
    }
    async delete(where: FindConditions<T>): Promise<DeleteResult> {
        const data = await this.repository.delete(where);
        this.pubsub.publish(MutationType.DELETED, {
            watch: { data, action: MutationType.DELETED }
        });
        return data;
    }
    // query
    async count(options?: FindManyOptions<T>): Promise<CountResultInput> {
        const count = await this.repository.count(options);
        return { count }
    }
    /**
     * TODO
     * @param options 
     */
    async findPage(options?: FindManyOptions<T>): Promise<MultiResult<T>> {
        const data = await this.repository.find(options);
        return { data }
    }
    async find(options?: FindConditions<T>): Promise<MultiResult<T>> {
        const relations: string[] = []
        this.meta.relations.map(relation => {
            const propertyName = relation.propertyName;
            relations.push(propertyName);
        });
        const data = await this.repository.find({ ...options, relations });
        return { data }
    }
    async findManyAndCount(options?: FindManyOptions<T>): Promise<FindAndCountResultInput<T>> {
        const relations: string[] = []
        this.meta.relations.map(relation => {
            const propertyName = relation.propertyName;
            relations.push(propertyName);
        });
        const data = await this.repository.findAndCount({ ...options, relations });
        return { data: data[0], count: data[1] }
    }
    async findAndCount(conditions?: FindConditions<T>): Promise<FindAndCountResultInput<T>> {
        const relations: string[] = []
        this.meta.relations.map(relation => {
            const propertyName = relation.propertyName;
            relations.push(propertyName);
        });
        const data = await this.repository.findAndCount({ ...conditions, relations });
        return { data: data[0], count: data[1] }
    }
    async findByIds(options: FindByIdsType<T>): Promise<MultiResult<T>> {
        const relations: string[] = []
        this.meta.relations.map(relation => {
            const propertyName = relation.propertyName;
            relations.push(propertyName);
        });
        const data = await this.repository.findByIds(options.ids, {
            ...options.options,
            relations
        });
        return { data: data }
    }
    async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
        const relations: string[] = []
        this.meta.relations.map(relation => {
            const propertyName = relation.propertyName;
            relations.push(propertyName);
        });
        return await this.repository.findOne({ ...options, relations });
    }
}