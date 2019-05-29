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
let OrganizationEntity = class OrganizationEntity {
    constructor() {
        this.create_time = new Date();
        this.update_time = new Date();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int'
    }),
    __metadata("design:type", Number)
], OrganizationEntity.prototype, "organization_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '英文名称'
    }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '中文名称'
    }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '描述备注'
    }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamp',
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], OrganizationEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamp',
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], OrganizationEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 11,
        comment: '排序'
    }),
    __metadata("design:type", Number)
], OrganizationEntity.prototype, "displayorder", void 0);
OrganizationEntity = __decorate([
    typeorm_1.Entity({
        name: 'organization'
    })
], OrganizationEntity);
exports.OrganizationEntity = OrganizationEntity;
