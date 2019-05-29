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
let RoleEntity = class RoleEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], RoleEntity.prototype, "role_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '英文代号',
        default: ''
    }),
    __metadata("design:type", String)
], RoleEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '中文名称',
        default: ''
    }),
    __metadata("design:type", String)
], RoleEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '描述备注',
        default: ''
    }),
    __metadata("design:type", String)
], RoleEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], RoleEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], RoleEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.ManyToMany(() => permission_entity_1.PermissionEntity),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], RoleEntity.prototype, "permissions", void 0);
RoleEntity = __decorate([
    typeorm_1.Entity({
        name: 'role'
    })
], RoleEntity);
exports.RoleEntity = RoleEntity;
