import { AddonEntity } from './addon.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';
/**
 * 应用权限表
 */
export declare class PermissionEntity {
    id: number;
    /**
     * 英文代号
     * 格式: addonName.permissionName
     * 唯一
     */
    name: string;
    /**
     * 上级
     */
    father_name: string;
    /**
     * 汉语名称
     */
    title: string;
    /**
     * 权限简介
     */
    decription: string;
    /**
     * 权限值,即操作符
     * 如：read,write,all...
     */
    value: string[];
    /**
     * 图标
     */
    icon: string;
    /**
     * 状态 -1禁止，0开发中,1正常
     */
    status: number;
    /**
     * 排序
     */
    displayorder: number;
    /**
     * 创建时间
     */
    create_time: Date;
    /**
     * 更新时间
     */
    update_time: Date;
    /**
     * 常用的，所以定义一下，查询后挂载到Permission上
     */
    /**
     * 拥有此权限的所有模块
     */
    addons: AddonEntity[];
    /**
     * 拥有此权限的所有用户
     */
    users: UserEntity[];
    /**
     * 拥有此权限的所有角色
     */
    roles: RoleEntity[];
}
