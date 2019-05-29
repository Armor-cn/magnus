"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MutationType;
(function (MutationType) {
    MutationType["CREATED"] = "CREATED";
    MutationType["UPDATED"] = "UPDATED";
    MutationType["DELETED"] = "DELETED";
})(MutationType = exports.MutationType || (exports.MutationType = {}));
var OrderType;
(function (OrderType) {
    OrderType["ASC"] = "ASC";
    OrderType["DESC"] = "DESC";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
const apollo_server_1 = require("apollo-server");
function isArgsMethod(args) {
    return Array.isArray(args) && args.length === 4;
}
exports.isArgsMethod = isArgsMethod;
function isArgsProperty(args) {
    return Array.isArray(args) && args.length === 3;
}
exports.isArgsProperty = isArgsProperty;
class Resolver {
    constructor(repository, name) {
        this.repository = repository;
        this.name = name;
        this.pubsub = new apollo_server_1.PubSub();
    }
    getQuery() {
        return {
            count: (...args) => {
                if (isArgsMethod(args)) {
                    return this.count(args[1].options);
                }
                else {
                    return this.count(args[0].options);
                }
            },
            find: (...args) => {
                if (isArgsMethod(args)) {
                    return this.find(args[1].options);
                }
                else if (isArgsProperty(args)) {
                    return this.find(args[0].options);
                }
            },
            findAndCount: (...args) => {
                if (isArgsMethod(args)) {
                    return this.findAndCount(args[1].conditions);
                }
                else {
                    return this.findAndCount(args[0].conditions);
                }
            },
            findByIds: (...args) => {
                if (isArgsMethod(args)) {
                    return this.findByIds(args[1].options);
                }
                else {
                    return this.findByIds(args[0].options);
                }
            },
            findOne: (...args) => {
                if (isArgsMethod(args)) {
                    return this.findOne(args[1].options);
                }
                else if (isArgsProperty(args)) {
                    return this.findOne(args[0].options);
                }
            }
        };
    }
    getMutation() {
        return {
            save: (...args) => {
                if (isArgsMethod(args)) {
                    return this.save(args[1].entity, args[1].option);
                }
                else {
                    return this.save(args[0].entity, args[0].option);
                }
            },
            remove: (...args) => {
                if (isArgsMethod(args)) {
                    return this.remove(args[1].entity, args[1].option);
                }
                else {
                    return this.remove(args[0].entity, args[0].option);
                }
            },
            insert: (...args) => {
                if (isArgsMethod(args)) {
                    return this.insert(args[1].entity);
                }
                else {
                    return this.insert(args[0].entity);
                }
            },
            update: (...args) => {
                if (isArgsMethod(args)) {
                    return this.update(args[1].where, args[1].options);
                }
                else {
                    return this.update(args[0].where, args[0].options);
                }
            },
            delete: (...args) => {
                if (isArgsMethod(args)) {
                    return this.delete(args[1].where);
                }
                else {
                    return this.delete(args[0].where);
                }
            }
        };
    }
    getSubscribtion() {
        return {
            watch: (...args) => {
                if (isArgsMethod(args)) {
                    return this.pubsub.asyncIterator(args[1].watch.mutation_in);
                }
                else {
                    return this.pubsub.asyncIterator(args[0].watch.mutation_in);
                }
            }
        };
    }
    async save(entity, options) {
        const data = await this.repository.save(entity, options);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return data;
    }
    async saves(options) {
        const data = await this.repository.save(options.data, options.options);
        return { data };
    }
    async remove(entity, options) {
        const data = await this.repository.remove(entity, options);
        this.pubsub.publish(MutationType.DELETED, {
            watch: { data, action: MutationType.DELETED }
        });
        return { code: 0, message: 'success' };
    }
    async removes(options) {
        const data = await this.repository.remove(options.data, options.options);
        return { data };
    }
    async insert(entity) {
        const data = await this.repository.insert(entity);
        this.pubsub.publish(MutationType.CREATED, {
            watch: { data, action: MutationType.CREATED }
        });
        return data;
    }
    async inserts(options) {
        return this.repository.insert(options);
    }
    async update(where, entity) {
        const data = await this.repository.update(where, entity);
        this.pubsub.publish(MutationType.UPDATED, {
            watch: { data, action: MutationType.UPDATED }
        });
        return { code: 0, message: 'success' };
    }
    async delete(where) {
        const data = await this.repository.delete(where);
        this.pubsub.publish(MutationType.DELETED, {
            watch: { data, action: MutationType.DELETED }
        });
        return data;
    }
    // query
    async count(options) {
        const count = await this.repository.count(options);
        return { count };
    }
    async findPage(options) {
        const data = await this.repository.find(options);
        return { data };
    }
    async find(options) {
        const data = await this.repository.find(options);
        return { data };
    }
    async findManyAndCount(options) {
        const data = await this.repository.findAndCount(options);
        return { data: data[0], count: data[1] };
    }
    async findAndCount(conditions) {
        const data = await this.repository.findAndCount(conditions);
        return { data: data[0], count: data[1] };
    }
    async findByIds(options) {
        const data = await this.repository.findByIds(options.ids, options.options);
        return { data: data };
    }
    async findOne(options) {
        return await this.repository.findOne(options);
    }
}
exports.Resolver = Resolver;
