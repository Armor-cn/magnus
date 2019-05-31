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
var ArticleCommentEntity_1;
"use strict";
const typeorm_1 = require("typeorm");
const article_entity_1 = require("./article.entity");
/**
 * 文章评论表
 */
let ArticleCommentEntity = ArticleCommentEntity_1 = class ArticleCommentEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ArticleCommentEntity.prototype, "article_comment_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        comment: '评论内容',
    }),
    __metadata("design:type", String)
], ArticleCommentEntity.prototype, "content", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ArticleCommentEntity_1, type => type.children),
    typeorm_1.JoinColumn({
        name: 'parent_id'
    }),
    __metadata("design:type", ArticleCommentEntity)
], ArticleCommentEntity.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(() => ArticleCommentEntity_1, type => type.parent),
    __metadata("design:type", Array)
], ArticleCommentEntity.prototype, "children", void 0);
__decorate([
    typeorm_1.Column({
        type: 'uuid',
        comment: '评论者'
    }),
    __metadata("design:type", String)
], ArticleCommentEntity.prototype, "from_user_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], ArticleCommentEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], ArticleCommentEntity.prototype, "update_time", void 0);
__decorate([
    typeorm_1.OneToOne(() => article_entity_1.ArticleEntity, type => type.category),
    typeorm_1.JoinColumn({
        name: 'article_id'
    }),
    __metadata("design:type", article_entity_1.ArticleEntity)
], ArticleCommentEntity.prototype, "article", void 0);
ArticleCommentEntity = ArticleCommentEntity_1 = __decorate([
    typeorm_1.Entity({
        name: 'article_comment'
    })
], ArticleCommentEntity);
exports.ArticleCommentEntity = ArticleCommentEntity;
