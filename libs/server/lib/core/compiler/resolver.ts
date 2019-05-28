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
export class Resolver<T> {
    pubsub: PubSub = new PubSub();
    constructor(public repository: Repository<T>, public name: string) { }
    getQuery() {
        return {
            count: (args: { options?: FindManyOptions<T> }) => this.count(args.options),
            find: (args: { options?: FindConditions<T> }) => this.find(args.options),
            findAndCount: (args: { conditions?: FindConditions<T> }) => this.findAndCount(args.conditions),
            findByIds: (args: { options: FindByIdsType<T> }) => this.findByIds(args.options),
            findOne: (args: { options: FindOneType<T> }) => this.findOne(args.options)
        }
    }
    getMutation() {
        return {
            save: (args: { entity: T, option?: SaveOptions }) => {
                return this.save(args.entity, args.option)
            },
            remove: (args: { entity: T, options?: RemoveOptions }) => {
                return this.remove(args.entity, args.options)
            },
            insert: (args: { entity: T }) => {
                return this.insert(args.entity)
            },
            update: (args: { where: FindConditions<T>, entity: any }) => {
                return this.update(args.where, args.entity)
            },
            delete: (args: { where: FindConditions<T> }) => {
                return this.delete(args.where)
            }
        }
    }
    getSubscribtion() {
        return {
            watch: (args: { watch: WatchInput }) => {
                return this.pubsub.asyncIterator(args.watch.mutation_in)
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