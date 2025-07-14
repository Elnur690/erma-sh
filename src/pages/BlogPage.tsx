
import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { GET_POSTS } from '@/lib/graphql/queries';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const BlogPage = () => {
  const { t } = useLanguage();
  const { data, loading } = useQuery(GET_POSTS, {
    variables: { first: 12 }
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const posts = data?.posts?.nodes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('blog.noArticles')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow">
              <Link to={`/blog/${post.slug}`}>
                {post.featuredImage?.node && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    {post.author?.node && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author.node.name}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                
                <CardContent>
                  <div
                    className="text-gray-600 line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                  
                  {post.categories?.nodes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.nodes.slice(0, 3).map((category: any) => (
                        <span
                          key={category.slug}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center text-primary font-medium">
                    {t('blog.readMore')}
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {data?.posts?.pageInfo?.hasNextPage && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t('blog.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
