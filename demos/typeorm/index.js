"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addon_entity_1 = require("./entities/permission/addon.entity");
exports.AddonEntity = addon_entity_1.AddonEntity;
const logger_entity_1 = require("./entities/logger.entity");
exports.LoggerEntity = logger_entity_1.LoggerEntity;
const organization_entity_1 = require("./entities/permission/organization.entity");
exports.OrganizationEntity = organization_entity_1.OrganizationEntity;
const permission_entity_1 = require("./entities/permission/permission.entity");
exports.PermissionEntity = permission_entity_1.PermissionEntity;
const refreshToken_entity_1 = require("./entities/token/refreshToken.entity");
exports.RefreshTokenEntity = refreshToken_entity_1.RefreshTokenEntity;
const role_entity_1 = require("./entities/permission/role.entity");
exports.RoleEntity = role_entity_1.RoleEntity;
const user_entity_1 = require("./entities/permission/user.entity");
exports.UserEntity = user_entity_1.UserEntity;
const accessToken_entity_1 = require("./entities/token/accessToken.entity");
exports.AccessTokenEntity = accessToken_entity_1.AccessTokenEntity;
exports.EXPRES_TIME = accessToken_entity_1.EXPRES_TIME;
const article_entity_1 = require("./entities/article/article.entity");
exports.ArticleEntity = article_entity_1.ArticleEntity;
const articleCategory_entity_1 = require("./entities/article/articleCategory.entity");
exports.ArticleCategoryEntity = articleCategory_entity_1.ArticleCategoryEntity;
const articleComment_entity_1 = require("./entities/article/articleComment.entity");
exports.ArticleCommentEntity = articleComment_entity_1.ArticleCommentEntity;
const member_entity_1 = require("./entities/member.entity");
const post_entity_1 = require("./entities/post.entity");
const postCategory_entity_1 = require("./entities/postCategory.entity");
exports.default = [
    addon_entity_1.AddonEntity,
    logger_entity_1.LoggerEntity,
    organization_entity_1.OrganizationEntity,
    permission_entity_1.PermissionEntity,
    refreshToken_entity_1.RefreshTokenEntity,
    role_entity_1.RoleEntity,
    user_entity_1.UserEntity,
    accessToken_entity_1.AccessTokenEntity,
    article_entity_1.ArticleEntity,
    articleCategory_entity_1.ArticleCategoryEntity,
    articleComment_entity_1.ArticleCommentEntity,
    member_entity_1.MemberEntity,
    post_entity_1.PostEntity,
    postCategory_entity_1.PostCategoryEntity
];
