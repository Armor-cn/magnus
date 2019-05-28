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
class Resolver {
    constructor(repository, name) {
        this.repository = repository;
        this.name = name;
        this.pubsub = new apollo_server_1.PubSub();
    }
    getQuery() {
        return {
            count: (args) => this.count(args.options),
            find: (args) => this.find(args.options),
            findAndCount: (args) => this.findAndCount(args.conditions),
            findByIds: (args) => this.findByIds(args.options),
            findOne: (args) => this.findOne(args.options)
        };
    }
    getMutation() {
        return {
            save: (args) => {
                return this.save(args.entity, args.option);
            },
            remove: (args) => {
                return this.remove(args.entity, args.options);
            },
            insert: (args) => {
                return this.insert(args.entity);
            },
            update: (args) => {
                return this.update(args.where, args.entity);
            },
            delete: (args) => {
                return this.delete(args.where);
            }
        };
    }
    getSubscribtion() {
        return {
            watch: (args) => {
                return this.pubsub.asyncIterator(args.watch.mutation_in);
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
        return data;
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
        return data;
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
        const data = await this.repository.findOne(options.id, options.options);
        if (data) {
            return { data };
        }
    }
}
exports.Resolver = Resolver;
