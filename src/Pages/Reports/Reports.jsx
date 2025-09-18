import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../Components/Hooks/useAxios";
import { toast } from "react-toastify";

const Reports = () => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    // Fetch reports
    const { data: reports, isLoading } = useQuery({
        queryKey: ["reports"],
        queryFn: async () => {
            const res = await axiosInstance.get("/reports");
            return res.data;
        },
    });

    // Mutation to solve report & increment warning
    const giveWarningMutation = useMutation({
        mutationFn: async (report) => {
            // Mark report as solved
            await axiosInstance.put(`/reports/solve/${report._id}`);
            // Increment user's warning
            await axiosInstance.put(`/users/incrementWarning/${report.commenterEmail}`);
        },
        onMutate: async (report) => {
            // Optimistic update: immediately mark report as solved
            await queryClient.cancelQueries(["reports"]);

            const previousReports = queryClient.getQueryData(["reports"]);

            queryClient.setQueryData(["reports"], (oldReports) =>
                oldReports.map((r) =>
                    r._id === report._id ? { ...r, solved: true } : r
                )
            );

            return { previousReports };
        },
        onError: (err, report, context) => {
            toast.error("Failed to give warning!");
            // Rollback if mutation failed
            queryClient.setQueryData(["reports"], context.previousReports);
        },
        onSuccess: () => {
            toast.success("Warning given successfully!");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["reports"]);
        },
    });

    if (isLoading) return <p>Loading reports...</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Reported Comments</h2>

            <div className="overflow-x-auto border rounded-lg shadow-md bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                                Commenter Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                                Comment Text
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                                Feedback
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reports?.map((report) => (
                            <tr key={report._id} className="bg-white">
                                <td className="px-6 py-4 text-sm text-gray-700">{report.commenterEmail}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{report.commentText}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{report.feedback}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <button
                                        className={`btn btn-sm ${report.solved
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : "bg-yellow-500 text-white"
                                            }`}
                                        disabled={report.solved}
                                        onClick={() => giveWarningMutation.mutate(report)}
                                    >
                                        {report.solved ? "Warned" : "Give Warning"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
