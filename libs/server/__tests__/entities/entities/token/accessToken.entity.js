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
const refreshToken_entity_1 = require("./refreshToken.entity");
exports.EXPRES_TIME = 60 * 60 * 24;
let AccessTokenEntity = class AccessTokenEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint'
    }),
    __metadata("design:type", Number)
], AccessTokenEntity.prototype, "access_token_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '授权凭证'
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "access_token", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '用户openid'
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "openid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '应用id'
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "appid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: 'ip地址'
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "ip", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '平台'
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "platform", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        comment: '授权类型'
    }),
    __metadata("design:type", Number)
], AccessTokenEntity.prototype, "grant_type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '授权范围'
    }),
    __metadata("design:type", String)
], AccessTokenEntity.prototype, "scope", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamptz',
        comment: '过期时间'
    }),
    __metadata("design:type", Date)
], AccessTokenEntity.prototype, "expires_in", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], AccessTokenEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], AccessTokenEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        comment: '1正常,-1过期/失效'
    }),
    __metadata("design:type", Number)
], AccessTokenEntity.prototype, "status", void 0);
__decorate([
    typeorm_1.OneToOne(() => refreshToken_entity_1.RefreshTokenEntity, type => type.token),
    __metadata("design:type", refreshToken_entity_1.RefreshTokenEntity)
], AccessTokenEntity.prototype, "refreshToken", void 0);
AccessTokenEntity = __decorate([
    typeorm_1.Entity({
        name: 'accessToken'
    })
], AccessTokenEntity);
exports.AccessTokenEntity = AccessTokenEntity;
