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
            count: this.count.bind(this),
            find: this.find.bind(this),
            findAndCount: this.findAndCount.bind(this),
            findByIds: this.findByIds.bind(this),
            findOne: this.findOne.bind(this)
        }
    }
    getMutation() {
        return {
            save: this.save.bind(this),
            remove: this.remove.bind(this),
            insert: this.insert.bind(this),
            update: this.update.bind(this),
            delete: this.delete.bind(this)
        }
    }
    getSubscribtion() {
        return {
            watch: (watch: WatchInput) => {
                return this.pubsub.asyncIterator(watch.mutation_in)
            }
        }
    }
    async save(entity: T, options: SaveOptions): Promise<SignalResult<T>> {
        const data = await this.repository.save(entity, options);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return { data };
    }
    async saves(options: SavesInput<T>): Promise<MultiResult<T>> {
        const data = await this.repository.save(options.data, options.options);
        return { data };
    }
    async remove(options: RemoveInput<T>): Promise<SignalResult<T>> {
        const data = await this.repository.remove(options.data, options.options);
        this.pubsub.publish(MutationType.DELETED, {
            watch: { data, action: MutationType.DELETED }
        });
        return { data }
    }
    async removes(options: RemovesInput<T>): Promise<MultiResult<T>> {
        const data = await this.repository.remove(options.data, options.options);
        return { data }
    }
    async insert(options: any): Promise<InsertResult> {
        const data = await this.repository.insert(options);
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