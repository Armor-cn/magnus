import { PermissionEntity } from './permission.entity';
export declare class RoleEntity {
    role_id: number;
    name: string;
    title: string;
    description: string;
    create_time: Date;
    update_time: Date;
    /**
     * 角色权限，常用，定义一下
     */
    permissions: PermissionEntity[];
}
