"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CalendarDays, ArrowLeft, Clock, User, Trash2 } from "lucide-react";
import type { Post } from "../types/blog";
import type { Comment } from "../types/blog";
import { blogApi } from "../lib/api";
import NewComment from "../components/newComment";
import { useAuth } from "../hooks/useAuth";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Array<Comment> | null>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const response = await blogApi.getPost(postId);
      setComments(response.data.comments);
      setPost(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCom = async (commentId: number) => {
    try {
      console.log(commentId);
      await blogApi.deleteComment(commentId);
      window.location.reload();
    } catch (error: any) {
      setError(error.response?.data?.message || "Échec de la publication");
    } finally {
      setLoading(false);
    }
  };

  const postId = post?.id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-sage/20 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-sage/20 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-sage/10 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-sage/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-stone py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-8">
            <CardContent>
              <h1 className="font-playfair text-3xl font-bold text-anthracite mb-4">
                Article Not Found
              </h1>
              <p className="text-anthracite/70 mb-6">
                {error || "The article you're looking for doesn't exist."}
              </p>
              <Link to="/">
                <Button className="bg-sage hover:bg-sage/90 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone">
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link to="/" className="inline-block mb-8">
            <Button
              variant="ghost"
              className="text-sage hover:text-sage/80 hover:bg-sage/10 p-0 h-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>

          {/* Article header */}
          <header className="mb-8 animate-fade-in-down">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-anthracite mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-anthracite/70 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{post.user.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{estimateReadingTime(post.content)} min read</span>
              </div>
            </div>
          </header>

          {/* Article content */}
          <Card className="bg-white/80 backdrop-blur-sm border-sage/20 animate-fade-in-up">
            <CardContent className="p-8 md:p-12">
              <div
                className="prose prose-lg max-w-none text-anthracite prose-headings:font-playfair prose-headings:text-anthracite prose-a:text-sage prose-a:no-underline hover:prose-a:underline prose-blockquote:border-sage prose-blockquote:text-anthracite/80"
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br />"),
                }}
              />
            </CardContent>
          </Card>

          {/* Article footer */}
          <footer className="mt-12 pt-8 border-t border-sage/20 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold text-anthracite">
                    {post.user.username}
                  </h3>
                  <p className="text-anthracite/60 text-sm">
                    Published on {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <Link to="/">
                <Button className="bg-sage hover:bg-sage/90 text-white">
                  More Articles
                </Button>
              </Link>
            </div>
          </footer>
          {/* Article comments */}

          {comments?.length === 0 ? (
            <h2 className="font-playfair text-2xl md:text-2xl font-bold text-anthracite mb-6 leading-tight mt-20">
              No comments yet
            </h2>
          ) : (
            <h2 className="font-playfair text-2xl md:text-2xl font-bold text-anthracite mb-6 leading-tight mt-20">
              Comments
            </h2>
          )}
          {comments?.map((el: any, i: number) => (
            <Card
              key={i}
              className="bg-white/80 backdrop-blur-sm border-sage/20 animate-fade-in-up m-5"
            >
              <CardContent className="">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div
                      className="prose prose-lg max-w-none text-anthracite prose-headings:font-playfair prose-headings:text-anthracite prose-a:text-sage prose-a:no-underline hover:prose-a:underline prose-blockquote:border-sage prose-blockquote:text-anthracite/80"
                      dangerouslySetInnerHTML={{
                        __html: el.content.replace(/\n/g, "<br />"),
                      }}
                    />
                    <div className="flex items-center gap-5">
                      <p className="font-playfair mt-10 text-sage/90">
                        From {el.user.username}
                      </p>
                      <p className="font-playfair mt-10 text-sage/90">
                        {formatDate(el.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Bouton de suppression aligné à droite */}
                  {el.user.id === user?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors ml-4 shrink-0"
                      onClick={() => handleDeleteCom(el.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          <NewComment postId={postId} />
        </div>
      </article>
    </div>
  );
}
