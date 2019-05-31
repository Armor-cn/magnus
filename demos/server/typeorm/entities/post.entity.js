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
let PostEntity = class PostEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PostEntity.prototype, "post_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '业务标题'
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '业务详情'
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        comment: '业务状态(0待处理，1处理中，2已处理，3无法处理)'
    }),
    __metadata("design:type", Number)
], PostEntity.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '处理人'
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "handler_user", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], PostEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], PostEntity.prototype, "update_time", void 0);
PostEntity = __decorate([
    typeorm_1.Entity({
        name: 'tasks'
    })
], PostEntity);
exports.PostEntity = PostEntity;
