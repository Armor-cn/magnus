import { Repository, FindManyOptions, FindOneOptions, UpdateResult, DeleteResult, FindConditions, InsertResult, RemoveOptions, SaveOptions } from 'typeorm';
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
interface WatchInput {
    mutation_in: MutationType[];
}
import { PubSub } from 'apollo-server';
export declare type ArgsMethod<T = any> = [undefined, T, any, any];
export declare type ArgsProperty<T = any> = [T, any, any];
export declare type Args<T = any> = ArgsMethod<T> | ArgsProperty<T>;
export declare function isArgsMethod<T>(args: Args<T>): args is ArgsMethod<T>;
export declare function isArgsProperty<T>(args: Args<T>): args is ArgsProperty<T>;
export declare class Resolver<T> {
    repository: Repository<T>;
    name: string;
    pubsub: PubSub;
    constructor(repository: Repository<T>, name: string);
    getQuery(): {
        count: (...args: Args<{
            options: FindManyOptions<any>;
        }>) => Promise<CountResultInput>;
        find: (...args: Args<{
            options?: FindConditions<T> | undefined;
        }>) => Promise<MultiResult<T>> | undefined;
        findAndCount: (...args: Args<{
            conditions?: FindConditions<T> | undefined;
        }>) => Promise<FindAndCountResultInput<T>>;
        findByIds: (...args: Args<{
            options: FindByIdsType<T>;
        }>) => Promise<MultiResult<T>>;
        findOne: (...args: Args<{
            options: FindOneOptions<T>;
        }>) => Promise<SignalResult<T> | undefined> | undefined;
    };
    getMutation(): {
        save: (...args: Args<{
            entity: T;
            option?: SaveOptions | undefined;
        }>) => Promise<T>;
        remove: (...args: Args<{
            entity: T;
            option?: RemoveOptions | undefined;
        }>) => Promise<T>;
        insert: (...args: Args<{
            entity: T;
        }>) => Promise<InsertResult>;
        update: (...args: Args<{
            where: FindConditions<T>;
            entity: any;
        }>) => Promise<UpdateResult>;
        delete: (...args: Args<{
            where: FindConditions<T>;
        }>) => Promise<DeleteResult>;
    };
    getSubscribtion(): {
        watch: (...args: Args<{
            watch: WatchInput;
        }>) => AsyncIterator<{}>;
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
    findOne(options: FindOneOptions<T>): Promise<SignalResult<T> | undefined>;
}
export {};
