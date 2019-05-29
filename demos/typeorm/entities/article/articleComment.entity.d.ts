import { ArticleEntity } from './article.entity';
/**
 * 文章评论表
 */
export declare class ArticleCommentEntity {
    article_comment_id: number;
    content: string;
    /**
     * 回复
     */
    parent: ArticleCommentEntity;
    children: ArticleCommentEntity[];
    from_user_id: string;
    create_time: Date;
    update_time: Date;
    article: ArticleEntity;
}
