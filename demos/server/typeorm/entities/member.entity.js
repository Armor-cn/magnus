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
let MemberEntity = class MemberEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MemberEntity.prototype, "member_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '昵称'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '姓名'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "realname", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '电话'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        comment: 'openid',
        default: ''
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "openid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 30,
        comment: '邮箱'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '用户名'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '密码'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '加密参数'
    }),
    __metadata("design:type", String)
], MemberEntity.prototype, "salt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], MemberEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], MemberEntity.prototype, "update_time", void 0);
MemberEntity = __decorate([
    typeorm_1.Entity({
        name: 'member'
    })
], MemberEntity);
exports.MemberEntity = MemberEntity;
