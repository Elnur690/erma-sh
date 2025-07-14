
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { GET_POSTS } from '@/lib/graphql/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const BlogPreview = () => {
  const { t } = useLanguage();
  const { data: postsData, loading } = useQuery(GET_POSTS, {
    variables: { first: 3 }
  });

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t('blog.latest')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const posts = postsData?.posts?.nodes || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">{t('blog.latest')}</h2>
        <Link to="/blog">
          <Button variant="outline">
            {t('viewAll')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow">
            <Link to={`/blog/${post.slug}`}>
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  {post.author && (
                    <>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author.node.name}</span>
                    </>
                  )}
                </div>
                {post.excerpt && (
                  <div 
                    className="text-gray-600 line-clamp-3 text-sm"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
