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
const articleCategory_entity_1 = require("./articleCategory.entity");
const articleComment_entity_1 = require("./articleComment.entity");
/**
 * 文章表
 */
let ArticleEntity = class ArticleEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "article_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 80,
        comment: '标题',
    }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '描述',
    }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '图片集',
    }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "thumbs", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        comment: '图标/缩略图',
    }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "icon", void 0);
__decorate([
    typeorm_1.ManyToOne(() => articleCategory_entity_1.ArticleCategoryEntity, type => type.article_category_id),
    typeorm_1.JoinColumn({
        name: 'article_cateogry_id'
    }),
    __metadata("design:type", articleCategory_entity_1.ArticleCategoryEntity)
], ArticleEntity.prototype, "category", void 0);
__decorate([
    typeorm_1.OneToMany(() => articleComment_entity_1.ArticleCommentEntity, type => type.article),
    __metadata("design:type", Array)
], ArticleEntity.prototype, "comments", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "update_time", void 0);
ArticleEntity = __decorate([
    typeorm_1.Entity({
        name: 'article',
    })
], ArticleEntity);
exports.ArticleEntity = ArticleEntity;
