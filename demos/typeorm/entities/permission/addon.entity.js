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
const permission_entity_1 = require("./permission.entity");
let AddonEntity = class AddonEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AddonEntity.prototype, "appid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '上级',
        default: 0
    }),
    __metadata("design:type", Number)
], AddonEntity.prototype, "pid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], AddonEntity.prototype, "appsecret", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        default: ''
    }),
    __metadata("design:type", String)
], AddonEntity.prototype, "icon", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], AddonEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], AddonEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: ''
    }),
    __metadata("design:type", String)
], AddonEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        default: 1
    }),
    __metadata("design:type", Number)
], AddonEntity.prototype, "status", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], AddonEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], AddonEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.ManyToMany(() => permission_entity_1.PermissionEntity),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], AddonEntity.prototype, "permissions", void 0);
AddonEntity = __decorate([
    typeorm_1.Entity({
        name: 'addon'
    })
], AddonEntity);
exports.AddonEntity = AddonEntity;
