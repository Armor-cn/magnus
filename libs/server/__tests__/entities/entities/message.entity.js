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
let MessageEntity = class MessageEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MessageEntity.prototype, "msg_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '消息'
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
        comment: '消息类型: 1:text,2:video,3:voide,4:shortvideo,5:location,6:link'
    }),
    __metadata("design:type", Number)
], MessageEntity.prototype, "msg_type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "pic_url", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '媒体id'
    }),
    __metadata("design:type", Number)
], MessageEntity.prototype, "media_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        comment: '视频消息媒体id'
    }),
    __metadata("design:type", Number)
], MessageEntity.prototype, "thumb_media_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '地理位置维度'
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "location_x", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 20,
        comment: '地理位置经度'
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "location_y", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
    }),
    typeorm_1.Column({
        type: 'varchar',
        length: 50,
        comment: '地理位置信息',
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "label", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        comment: '标题',
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        comment: '链接',
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        comment: '描述',
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'uuid',
        comment: '发送者openid'
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "from_user", void 0);
__decorate([
    typeorm_1.Column({
        type: 'uuid',
        comment: '接受者openid'
    }),
    __metadata("design:type", String)
], MessageEntity.prototype, "to_user", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], MessageEntity.prototype, "create_time", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], MessageEntity.prototype, "update_time", void 0);
MessageEntity = __decorate([
    typeorm_1.Entity({
        name: 'message'
    })
], MessageEntity);
exports.MessageEntity = MessageEntity;
