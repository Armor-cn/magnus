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
const accessToken_entity_1 = require("./accessToken.entity");
let RefreshTokenEntity = class RefreshTokenEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int'
    }),
    __metadata("design:type", Number)
], RefreshTokenEntity.prototype, "refresh_token_id", void 0);
__decorate([
    typeorm_1.OneToOne(() => accessToken_entity_1.AccessTokenEntity, type => type.refreshToken),
    typeorm_1.JoinColumn({
        name: 'token_id'
    }),
    __metadata("design:type", accessToken_entity_1.AccessTokenEntity)
], RefreshTokenEntity.prototype, "token", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '刷新凭证'
    }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "refresh_token", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamptz',
        comment: '过期时间'
    }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "expires_in", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "update_time", void 0);
RefreshTokenEntity = __decorate([
    typeorm_1.Entity({
        name: 'refreshToken'
    })
], RefreshTokenEntity);
exports.RefreshTokenEntity = RefreshTokenEntity;
