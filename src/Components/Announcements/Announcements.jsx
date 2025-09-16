import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Components/Hooks/useAxios";

const Announcements = () => {
  const axiosInstance = useAxios();

  // Fetch announcements from backend
  const { data: announcements, isLoading, isError } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosInstance.get("/announcements");
      return res.data; // should return an array of announcements
    },
  });

  if (isLoading) return <p className="p-6">Loading announcements...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load announcements</p>;

  if (!announcements || announcements.length === 0) return null; // Hide if no announcements

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
       
      </div>

      <div className="space-y-4">
        {announcements.map((announcement, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center mb-2">
              <img
                src={announcement.authorImage}
                alt={announcement.authorName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="font-semibold text-gray-700">
                {announcement.authorName}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">
              {announcement.title}
            </h3>
            <p className="text-gray-600">{announcement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
