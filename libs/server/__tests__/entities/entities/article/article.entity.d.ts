import { ArticleCategoryEntity } from './articleCategory.entity';
import { ArticleCommentEntity } from './articleComment.entity';
/**
 * 文章表
 */
export declare class ArticleEntity {
    article_id: number;
    title: string;
    description: string;
    thumbs: string;
    icon: string;
    /**
     * 文章的类型
     */
    category: ArticleCategoryEntity;
    /**
     * 文章下面的评论
     */
    comments: ArticleCommentEntity[];
    create_time: Date;
    update_time: Date;
}
