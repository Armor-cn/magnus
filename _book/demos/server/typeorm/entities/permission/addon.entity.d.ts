import { PermissionEntity } from './permission.entity';
export declare class AddonEntity {
    appid: number;
    pid: number;
    appsecret: string;
    icon: string;
    name: string;
    title: string;
    description: string;
    status: number;
    create_time: Date;
    update_time: Date;
    /**
     * 应用权限
     * 一个应用有多个权限
     * 一个权限也可以有多个应用
     */
    permissions: PermissionEntity[];
}
