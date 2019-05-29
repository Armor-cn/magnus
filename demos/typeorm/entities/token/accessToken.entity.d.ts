import { RefreshTokenEntity } from './refreshToken.entity';
export declare const EXPRES_TIME: number;
export declare class AccessTokenEntity {
    access_token_id: number;
    /**
     * 根据access_token查询用户Openid，添加Index
     */
    access_token: string;
    openid: string;
    appid: string;
    ip: string;
    platform: string;
    grant_type: number;
    scope: string;
    expires_in: Date;
    create_time: Date;
    update_time: Date;
    status: number;
    /**
     * 刷新凭证
     */
    refreshToken: RefreshTokenEntity;
}
