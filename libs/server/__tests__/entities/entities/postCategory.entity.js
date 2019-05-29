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
let PostCategoryEntity = class PostCategoryEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PostCategoryEntity.prototype, "post_post_category_idid", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '分类名'
    }),
    __metadata("design:type", String)
], PostCategoryEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        comment: '分类图标'
    }),
    __metadata("design:type", String)
], PostCategoryEntity.prototype, "icon", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '分类描述'
    }),
    __metadata("design:type", String)
], PostCategoryEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], PostCategoryEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], PostCategoryEntity.prototype, "update_time", void 0);
PostCategoryEntity = __decorate([
    typeorm_1.Entity({
        name: 'postCategory'
    })
], PostCategoryEntity);
exports.PostCategoryEntity = PostCategoryEntity;
