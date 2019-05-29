"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let LoggerEntity = class LoggerEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int'
    }),
    __metadata("design:type", Number)
], LoggerEntity.prototype, "logger_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '描述',
        default: ''
    }),
    __metadata("design:type", String)
], LoggerEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        default: ''
    }),
    __metadata("design:type", String)
], LoggerEntity.prototype, "openid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        comment: '开始时间'
    }),
    __metadata("design:type", Date)
], LoggerEntity.prototype, "start_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        comment: '结束时间'
    }),
    __metadata("design:type", Date)
], LoggerEntity.prototype, "end_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '参数'
    }),
    __metadata("design:type", String)
], LoggerEntity.prototype, "params", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: 'ip地址',
        default: ''
    }),
    __metadata("design:type", String)
], LoggerEntity.prototype, "ip", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '相应结果',
        default: ''
    }),
    __metadata("design:type", String)
], LoggerEntity.prototype, "result", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '权限值,一些列权限组合',
        default: ''
    }),
    __metadata("design:type", String)
], LoggerEntity.prototype, "permissions", void 0);
LoggerEntity = __decorate([
    typeorm_1.Entity({
        name: 'logger'
    })
], LoggerEntity);
exports.LoggerEntity = LoggerEntity;
