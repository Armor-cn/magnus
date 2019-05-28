import { Repository, FindManyOptions, FindOneOptions, ObjectID, UpdateResult, DeleteResult, FindConditions, InsertResult, RemoveOptions, SaveOptions } from 'typeorm';
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
    data: number;
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
export class Resolver<T> {
    constructor(public repository: Repository<T>) { }
    async save(options: SaveInput<T>): Promise<SignalResult<T>> {
        const data = await this.repository.save(options.data, options.options);
        return { data };
    }
    async saves(options: SavesInput<T>): Promise<MultiResult<T>> {
        const data = await this.repository.save(options.data, options.options);
        return { data };
    }
    async remove(options: RemoveInput<T>): Promise<SignalResult<T>> {
        const data = await this.repository.remove(options.data, options.options);
        return { data }
    }
    async removes(options: RemovesInput<T>): Promise<MultiResult<T>> {
        const data = await this.repository.remove(options.data, options.options);
        return { data }
    }
    async insert(options: any): Promise<InsertResult> {
        return this.repository.insert(options);
    }
    async inserts(options: any[]): Promise<InsertResult> {
        return this.repository.insert(options)
    }
    async update(where: FindConditions<T>, entity: any): Promise<UpdateResult> {
        return this.repository.update(where, entity);
    }
    async delete(where: FindConditions<T>): Promise<DeleteResult> {
        return this.repository.delete(where);
    }
    // query
    async count(options?: FindManyOptions<T>): Promise<CountResultInput> {
        const data = await this.repository.count(options);
        return { data }
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