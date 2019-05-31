import { AccessTokenEntity } from './accessToken.entity';
export declare class RefreshTokenEntity {
    refresh_token_id: number;
    token: AccessTokenEntity;
    refresh_token: string;
    expires_in: Date;
    create_time: Date;
    update_time: Date;
}
