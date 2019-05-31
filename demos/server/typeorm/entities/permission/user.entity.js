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
const organization_entity_1 = require("./organization.entity");
const permission_entity_1 = require("./permission.entity");
let UserEntity = class UserEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserEntity.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'uuid',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "openid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '联盟id'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "unionid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '盐'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "salt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '真实姓名'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "realname", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '昵称'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 30
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        default: 0
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sex", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.ManyToMany(() => permission_entity_1.PermissionEntity),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], UserEntity.prototype, "permissions", void 0);
__decorate([
    typeorm_1.ManyToMany(() => organization_entity_1.OrganizationEntity),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], UserEntity.prototype, "roles", void 0);
__decorate([
    typeorm_1.ManyToMany(() => organization_entity_1.OrganizationEntity),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], UserEntity.prototype, "organizations", void 0);
UserEntity = __decorate([
    typeorm_1.Entity({
        name: 'user'
    })
], UserEntity);
exports.UserEntity = UserEntity;
