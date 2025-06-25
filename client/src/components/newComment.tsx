import { useForm, type SubmitHandler } from "react-hook-form";
import { blogApi } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { Send } from "lucide-react";
import { Button } from "./ui/button";

type commentInputs = {
  content: string;
  userId: number;
  postId: number;
};

export default function NewComment({ postId }: { postId: number | undefined }) {
  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors },
  } = useForm<commentInputs>({ criteriaMode: "all" });
  const { user } = useAuth();

  const onCommentSubmit: SubmitHandler<commentInputs> = async (data) => {
    if (!postId || !user?.id) {
      console.error("PostId or UserId missing");
      return;
    }
    try {
      await blogApi.createComment({
        content: data.content,
        userId: user.id,
        postId: postId,
      });
      window.location.reload();
    } catch (error: any) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <form
      onSubmit={handleCommentSubmit(onCommentSubmit)}
      className="mt-12 bg-white/90 backdrop-blur-sm border border-sage/20 rounded-2xl p-6 md:p-8 shadow-md space-y-4 animate-fade-in-up"
    >
      <h3 className="text-2xl font-playfair font-semibold text-anthracite">
        Leave a comment
      </h3>

      <div className="flex flex-col space-y-2">
        <label htmlFor="content" className="text-sm text-anthracite/80">
          Your comment
        </label>
        <textarea
          id="content"
          {...registerComment("content", {
            required: "Comment cannot be empty",
            minLength: { value: 5, message: "At least 5 characters required" },
          })}
          className="w-full h-32 p-4 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-sage/50 bg-stone/10 text-anthracite placeholder:text-anthracite/40"
          placeholder="Type your thoughts here..."
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="flex items-center gap-2 bg-sage hover:bg-sage/90 text-white"
      >
        <Send className="w-4 h-4" />
        Submit
      </Button>
    </form>
  );
}
