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
var ArticleCategoryEntity_1;
"use strict";
const typeorm_1 = require("typeorm");
const article_entity_1 = require("./article.entity");
/**
 * 文章分类表
 */
let ArticleCategoryEntity = ArticleCategoryEntity_1 = class ArticleCategoryEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ArticleCategoryEntity.prototype, "article_category_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '标题',
    }),
    __metadata("design:type", String)
], ArticleCategoryEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], ArticleCategoryEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        comment: '图标'
    }),
    __metadata("design:type", String)
], ArticleCategoryEntity.prototype, "icon", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ArticleCategoryEntity_1, type => type.children),
    typeorm_1.JoinColumn({
        name: 'pid'
    }),
    __metadata("design:type", ArticleCategoryEntity)
], ArticleCategoryEntity.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(() => ArticleCategoryEntity_1, type => type.parent),
    __metadata("design:type", Array)
], ArticleCategoryEntity.prototype, "children", void 0);
__decorate([
    typeorm_1.OneToMany(() => article_entity_1.ArticleEntity, type => type.category),
    __metadata("design:type", Array)
], ArticleCategoryEntity.prototype, "articles", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '描述',
    }),
    __metadata("design:type", String)
], ArticleCategoryEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], ArticleCategoryEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], ArticleCategoryEntity.prototype, "update_time", void 0);
ArticleCategoryEntity = ArticleCategoryEntity_1 = __decorate([
    typeorm_1.Entity({
        name: 'article_category'
    })
], ArticleCategoryEntity);
exports.ArticleCategoryEntity = ArticleCategoryEntity;
