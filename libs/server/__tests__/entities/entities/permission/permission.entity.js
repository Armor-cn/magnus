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
const addon_entity_1 = require("./addon.entity");
const role_entity_1 = require("./role.entity");
const user_entity_1 = require("./user.entity");
/**
 * 应用权限表
 */
let PermissionEntity = class PermissionEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PermissionEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PermissionEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar'
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "father_name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        default: ''
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "decription", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 255
    }),
    __metadata("design:type", Array)
], PermissionEntity.prototype, "value", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        default: ''
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "icon", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        default: 0
    }),
    typeorm_1.Index(),
    __metadata("design:type", Number)
], PermissionEntity.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 0
    }),
    __metadata("design:type", Number)
], PermissionEntity.prototype, "displayorder", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], PermissionEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], PermissionEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.ManyToMany(() => addon_entity_1.AddonEntity),
    __metadata("design:type", Array)
], PermissionEntity.prototype, "addons", void 0);
__decorate([
    typeorm_1.ManyToMany(() => user_entity_1.UserEntity),
    __metadata("design:type", Array)
], PermissionEntity.prototype, "users", void 0);
__decorate([
    typeorm_1.ManyToMany(() => role_entity_1.RoleEntity),
    __metadata("design:type", Array)
], PermissionEntity.prototype, "roles", void 0);
PermissionEntity = __decorate([
    typeorm_1.Entity({
        name: 'permission'
    })
], PermissionEntity);
exports.PermissionEntity = PermissionEntity;
