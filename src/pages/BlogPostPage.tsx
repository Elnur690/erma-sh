
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GET_POST_BY_SLUG } from '@/lib/graphql/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, loading, error } = useQuery(GET_POST_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const post = data.post;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Blog */}
      <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center space-x-6 text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.date).toLocaleDateString()}
            </div>
            {post.author?.node && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author.node.name}
              </div>
            )}
          </div>

          {post.categories?.nodes?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.nodes.map((category: any) => (
                <span
                  key={category.slug}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage?.node && (
          <div className="mb-8">
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Tags */}
        {post.tags?.nodes?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag: any) => (
                <span
                  key={tag.slug}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        {post.author?.node && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {post.author.node.avatar?.url && (
                  <img
                    src={post.author.node.avatar.url}
                    alt={post.author.node.name}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{post.author.node.name}</h3>
                  {post.author.node.description && (
                    <p className="text-gray-600 mt-2">{post.author.node.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;
