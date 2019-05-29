import { OrganizationEntity } from './organization.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';
export declare class UserEntity {
    user_id: number;
    openid: string;
    unionid: string;
    username: string;
    password: string;
    salt: string;
    realname: string;
    nickname: string;
    avatar: string;
    phone: string;
    email: string;
    sex: number;
    create_time: Date;
    update_time: Date;
    /**
     * 常用，定义一下
     */
    /**
     * 用户拥有的权限，一个用户可以有多个权限
     */
    permissions: PermissionEntity[];
    /**
     * 用户拥有的角色，一个用户可以分配多个角色
     */
    roles: RoleEntity[];
    /**
     * 用户所属组织，一个用户可以有多个组织，
     */
    organizations: OrganizationEntity[];
}
