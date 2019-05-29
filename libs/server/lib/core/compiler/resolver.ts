import { Repository, FindManyOptions, FindOneOptions, ObjectID, UpdateResult, DeleteResult, FindConditions, InsertResult, RemoveOptions, SaveOptions } from 'typeorm';
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
export type ArgsMethod<T = any> = [undefined, T, any, any];
export type ArgsProperty<T = any> = [T, any, any];
export type Args<T = any> = ArgsMethod<T> | ArgsProperty<T>;
export function isArgsMethod<T>(args: Args<T>): args is ArgsMethod<T> {
    return args.length === 4;
}
export function isArgsProperty<T>(args: Args<T>): args is ArgsProperty<T> {
    return args.length === 3;
}
export class Resolver<T> {
    pubsub: PubSub = new PubSub();
    constructor(public repository: Repository<T>, public name: string) { }
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
                    return this.find(args[1].options)
                } else {
                    return this.find(args[0].options)
                }
            },
            findAndCount: (...args: Args<{ conditions?: FindConditions<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.findAndCount(args[1].conditions)
                } else {
                    return this.findAndCount(args[0].conditions)
                }
            },
            findByIds: (args: Args<{ options: FindByIdsType<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.findByIds(args[1].options)
                } else {
                    return this.findByIds(args[0].options)
                }
            },
            findOne: (args: Args<{ options: FindOneType<T> }>) => {
                if (isArgsMethod(args)) {
                    return this.findOne(args[1].options)
                } else {
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
            remove: (...args: Args<{ entity: T, option?: RemoveOptions }>) => {
                if (isArgsMethod(args)) {
                    return this.remove(args[1].entity, args[1].option)
                } else {
                    return this.remove(args[0].entity, args[0].option)
                }
            },
            insert: (...args: Args<{ entity: T }>) => {
                if (isArgsMethod(args)) {
                    return this.insert(args[1].entity)
                } else {
                    return this.insert(args[0].entity)
                }
            },
            update: (args: Args<{ where: FindConditions<T>, entity: any }>) => {
                if (isArgsMethod(args)) {
                    return this.update(args[1].where, args[1].entity)
                } else {
                    return this.update(args[0].where, args[0].where)
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
        const data = await this.repository.save(entity, options);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return data;
    }
    async saves(options: SavesInput<T>): Promise<MultiResult<T>> {
        const data = await this.repository.save(options.data, options.options);
        return { data };
    }
    async remove(entity: T, options?: RemoveOptions): Promise<T> {
        const data = await this.repository.remove(entity, options);
        this.pubsub.publish(MutationType.DELETED, {
            watch: { data, action: MutationType.DELETED }
        });
        return data;
    }
    async removes(options: RemovesInput<T>): Promise<MultiResult<T>> {
        const data = await this.repository.remove(options.data, options.options);
        return { data }
    }
    async insert(entity: any): Promise<InsertResult> {
        const data = await this.repository.insert(entity);
        this.pubsub.publish(MutationType.CREATED, {
            watch: { data, action: MutationType.CREATED }
        });
        return data;
    }
    async inserts(options: any[]): Promise<InsertResult> {
        return this.repository.insert(options)
    }
    async update(where: FindConditions<T>, entity: any): Promise<UpdateResult> {
        const data = await this.repository.update(where, entity);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return data;
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
    async findPage(options?: FindManyOptions<T>): Promise<MultiResult<T>> {
        const data = await this.repository.find(options);
        return { data }
    }
    async find(options?: FindConditions<T>): Promise<MultiResult<T>> {
        const data = await this.repository.find(options);
        return { data }
    }
    async findManyAndCount(options?: FindManyOptions<T>): Promise<FindAndCountResultInput<T>> {
        const data = await this.repository.findAndCount(options);
        return { data: data[0], count: data[1] }
    }
    async findAndCount(conditions?: FindConditions<T>): Promise<FindAndCountResultInput<T>> {
        const data = await this.repository.findAndCount(conditions);
        return { data: data[0], count: data[1] }
    }
    async findByIds(options: FindByIdsType<T>): Promise<MultiResult<T>> {
        const data = await this.repository.findByIds(options.ids, options.options);
        return { data: data }
    }
    async findOne(options: FindOneType<T>): Promise<SignalResult<T> | undefined> {
        const data = await this.repository.findOne(options.id, options.options);
        if (data) {
            return { data }
        }
    }
}