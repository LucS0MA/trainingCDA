import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CalendarDays, User, ArrowRight, BookOpen } from "lucide-react";
import type { Post } from "../types/blog";
import { blogApi } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await blogApi.getPosts();
      const postsData = response.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  function extractFirstImageSrcFromHtml(html: string): string | null {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    return match ? match[1] : null;
  }

  const thumb = (post: Post): string | null =>
    extractFirstImageSrcFromHtml(post.content);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-stone via-stone to-sage/10 py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className={`font-playfair text-5xl md:text-7xl font-bold text-anthracite mb-6 ${
                mounted ? "animate-fade-in-down" : "opacity-0"
              }`}
            >
              Welcome to <span className="text-sage">WebCraft</span>
            </h1>
            <p
              className={`text-xl md:text-2xl text-anthracite/70 mb-8 max-w-3xl mx-auto leading-relaxed ${
                mounted ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              Discover articles about the web developement sphere, insights, ideas and tutorials from developpers around the
              world. Join our community of passionate web developpers.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${
                mounted ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              <Link to={`http://localhost:7000/article/1`}>
              <Button
                size="lg"
                className="bg-sage hover:bg-sage/90 text-white px-8 py-3 text-lg"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Start Reading
              </Button>
              </Link>
              {/* <Button
                variant="outline"
                size="lg"
                className="border-sage text-sage hover:bg-sage hover:text-white px-8 py-3 text-lg"
              >
                Learn More
              </Button> */}
            </div>
          </div>
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-sage/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-sage/5 rounded-full blur-2xl"></div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 ${
              mounted ? "animate-slide-in-left" : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-anthracite mb-4">
              Latest Stories
            </h2>
            <p className="text-xl text-anthracite/70 max-w-2xl mx-auto">
              Explore our most recent articles, tutorials and researches
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-sage/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-sage/10 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-sage/10 rounded"></div>
                      <div className="h-3 bg-sage/10 rounded w-5/6"></div>
                      <div className="h-3 bg-sage/10 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Card
                  key={post.id}
                  className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-sage/20 ${
                    mounted ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  {thumb(post) && (
                    <img
                      src={thumb(post) as string}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="font-playfair text-xl group-hover:text-sage transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-anthracite/60">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.user?.username}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(post.createdAt)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/article/${post.id}`}>
                      <Button
                        variant="ghost"
                        className="text-sage hover:text-sage/80 hover:bg-sage/10 p-0 h-auto font-semibold"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-sage/50 mx-auto mb-4" />
              <h3 className="font-playfair text-2xl text-anthracite mb-2">
                No posts yet
              </h3>
              <p className="text-anthracite/60">
                Be the first to share your story!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-sage/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`${mounted ? "animate-slide-in-right" : "opacity-0"}`}
            style={{ animationDelay: "1s" }}
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-anthracite mb-4">
              Ready to Share Your Knowledge?
            </h2>
            <p className="text-xl text-anthracite/70 mb-8">
              Join our community of web devs and start helping developpers in need !
            </p>
            {user ? (
              <Link to="/NewArticle">
              <Button
                size="lg"
                className="bg-sage hover:bg-sage/90 text-white px-8 py-3 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            ) : (
              <Link to="/register">
              <Button
                size="lg"
                className="bg-sage hover:bg-sage/90 text-white px-8 py-3 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
