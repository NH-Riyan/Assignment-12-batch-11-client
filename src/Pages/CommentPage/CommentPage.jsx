import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import useAxios from "../../Components/Hooks/useAxios";
import { AuthContext } from "../../Context/AuthContext";


const feedbackOptions = [
  "Spam or misleading",
  "Offensive content",
  "Irrelevant comment",
];

const CommentPage = () => {
  const axiosInstance = useAxios();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedFeedback, setSelectedFeedback] = useState({});
  const { user } = useContext(AuthContext);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/${id}`);
      return res.data;
    },
  });

  const reportMutation = useMutation({
    mutationFn: async ({ commentId, feedback }) => {
      const comment = post.Comment.find((c) => c._id === commentId);

      const reportData = {
        postId: id,
        postTitle: post.title,
        commentId: comment._id,
        commenterEmail: comment.commenterEmail,
        commentText: comment.commentText,
        feedback,
        solved:false,
        reportedAt: new Date().toISOString(),
      };


      await axiosInstance.post("/reports", reportData);

      await axiosInstance.put(`/posts/reportComment/${id}`, {
        commentId,
        feedback,
      });
    },
    onSuccess: () => {
      toast.success("Comment reported successfully!");
      queryClient.invalidateQueries(["post", id]);
    },
    onError: () => {
      toast.error("Failed to report comment!");
    },
  });

  if (isLoading) return <p>Loading comments...</p>;

  const comments = post?.Comment;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments</h2>

      <div className="overflow-x-auto border rounded-lg shadow-md bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                Report
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comments.filter((comment) => comment.commenterEmail !== user.email)
              .map((comment, idx) => {
                const isReportDisabled =
                  !selectedFeedback[comment._id] || comment.reported;

                return (
                  <tr
                    key={comment._id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {comment.commenterEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                      {comment.commentText}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <select
                        value={selectedFeedback[comment._id]}
                        onChange={(e) =>
                          setSelectedFeedback((prev) => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                        className="select select-bordered w-full max-w-xs"
                      >
                        <option value="">Select feedback</option>
                        {feedbackOptions.map((fb, i) => (
                          <option key={i} value={fb}>
                            {fb}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <button
                        className={`btn btn-sm ${comment.reported ? "btn-disabled" : "bg-red-500"
                          }`}
                        disabled={isReportDisabled}
                        onClick={() =>
                          reportMutation.mutate({
                            commentId: comment._id,
                            feedback: selectedFeedback[comment._id],
                          })
                        }
                      >
                        {comment.reported ? "Reported" : "Report"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentPage;
