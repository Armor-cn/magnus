import { ArticleEntity } from './article.entity';
/**
 * 文章分类表
 */
export declare class ArticleCategoryEntity {
    article_category_id: number;
    title: string;
    name: string;
    icon: string;
    /**
     * 分类的上级
     */
    parent: ArticleCategoryEntity;
    /**
     * 分类下面的子分类
     */
    children: ArticleCategoryEntity[];
    /**
     * 分类下面的文章
     */
    articles: ArticleEntity[];
    description: string;
    create_time: Date;
    update_time: Date;
}
