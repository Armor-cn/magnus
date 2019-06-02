import { GraphQLResolveInfo } from 'graphql';
import { FindManyOptions, FindOneOptions, DeleteResult, FindConditions, SaveOptions, RemoveOptions } from 'typeorm';
export type ArgsMethod<T = any> = [undefined, T, any, GraphQLResolveInfo];
export type ArgsProperty<T = any> = [T, any, GraphQLResolveInfo];
export type Args<T = any> = ArgsMethod<T> | ArgsProperty<T>;
export interface IUpdateResult {
    code: number;
    message: string;
}
export enum MutationType {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED'
}
interface WatchInput {
    mutation_in: MutationType[];
}
interface WatchResult<T> {
    data: T;
    action: MutationType;
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
export interface QueryResult<T> {
    count: (...args: Args<{ options: FindManyOptions<T> }>) => Promise<CountResultInput>;
    find: (...args: Args<{ options?: FindManyOptions<T> }>) => Promise<T[]>;
    findAndCount: (...args: Args<{ conditions?: FindManyOptions<T> }>) => Promise<FindAndCountResultInput<T>>;
    findByIds: (...args: Args<{ options: FindByIdsType<T> }>) => Promise<T[]>;
    findOne: (...args: Args<{ options: FindOneOptions<T> }>) => Promise<T>;
}
export interface MutationResult<T> {
    save: (...args: Args<{ entity: T, option?: SaveOptions }>) => Promise<T>;
    saves: (...args: Args<{ entities: T[], option?: SaveOptions }>) => Promise<T[]>;
    remove: (...args: Args<{ entity: T, option?: RemoveOptions }>) => Promise<T>;
    removes: (...args: Args<{ entities: T[], option?: RemoveOptions }>) => Promise<T[]>;
    insert: (...args: Args<{ entity: T }>) => Promise<T>;
    update: (...args: Args<{ where: FindConditions<T>, options: T }>) => Promise<T>;
    delete: (...args: Args<{ where: FindConditions<T> }>) => Promise<DeleteResult>;
}
export interface SubscribtionResult<T> {
    watch: (...args: Args<{ watch: WatchInput }>) => Promise<WatchResult<T>>;
}
export abstract class Adapter<T> {
    abstract getQuery(): QueryResult<T>;
    abstract getMutation(): MutationResult<T>;
    abstract getSubscribtion(): SubscribtionResult<T>;
}
