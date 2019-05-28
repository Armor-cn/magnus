import { Repository, FindManyOptions, FindOneOptions, ObjectID, UpdateResult, DeleteResult, FindConditions, InsertResult, RemoveOptions, SaveOptions } from 'typeorm';
export declare enum MutationType {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED"
}
export declare enum OrderType {
    ASC = "ASC",
    DESC = "DESC"
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
    options?: FindManyOptions<T>;
}
interface FindOneType<T> {
    id?: string | number | Date | ObjectID;
    options?: FindOneOptions<T>;
}
interface WatchInput {
    mutation_in: MutationType[];
}
import { PubSub } from 'apollo-server';
export declare class Resolver<T> {
    repository: Repository<T>;
    name: string;
    pubsub: PubSub;
    constructor(repository: Repository<T>, name: string);
    getQuery(): {
        count: (args: {
            options?: FindManyOptions<T> | undefined;
        }) => Promise<CountResultInput>;
        find: (args: {
            options?: FindConditions<T> | undefined;
        }) => Promise<MultiResult<T>>;
        findAndCount: (args: {
            conditions?: FindConditions<T> | undefined;
        }) => Promise<FindAndCountResultInput<T>>;
        findByIds: (args: {
            options: FindByIdsType<T>;
        }) => Promise<MultiResult<T>>;
        findOne: (args: {
            options: FindOneType<T>;
        }) => Promise<SignalResult<T> | undefined>;
    };
    getMutation(): {
        save: (args: {
            entity: T;
            option?: SaveOptions | undefined;
        }) => Promise<T>;
        remove: (args: {
            entity: T;
            options?: RemoveOptions | undefined;
        }) => Promise<T>;
        insert: (args: {
            entity: T;
        }) => Promise<InsertResult>;
        update: (args: {
            where: FindConditions<T>;
            entity: any;
        }) => Promise<UpdateResult>;
        delete: (args: {
            where: FindConditions<T>;
        }) => Promise<DeleteResult>;
    };
    getSubscribtion(): {
        watch: (args: {
            watch: WatchInput;
        }) => AsyncIterator<{}>;
    };
    save(entity: T, options?: SaveOptions): Promise<T>;
    saves(options: SavesInput<T>): Promise<MultiResult<T>>;
    remove(entity: T, options?: RemoveOptions): Promise<T>;
    removes(options: RemovesInput<T>): Promise<MultiResult<T>>;
    insert(entity: any): Promise<InsertResult>;
    inserts(options: any[]): Promise<InsertResult>;
    update(where: FindConditions<T>, entity: any): Promise<UpdateResult>;
    delete(where: FindConditions<T>): Promise<DeleteResult>;
    count(options?: FindManyOptions<T>): Promise<CountResultInput>;
    findPage(options?: FindManyOptions<T>): Promise<MultiResult<T>>;
    find(options?: FindConditions<T>): Promise<MultiResult<T>>;
    findManyAndCount(options?: FindManyOptions<T>): Promise<FindAndCountResultInput<T>>;
    findAndCount(conditions?: FindConditions<T>): Promise<FindAndCountResultInput<T>>;
    findByIds(options: FindByIdsType<T>): Promise<MultiResult<T>>;
    findOne(options: FindOneType<T>): Promise<SignalResult<T> | undefined>;
}
export {};
