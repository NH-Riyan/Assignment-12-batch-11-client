import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../../Components/Hooks/useAxiosSecure";


const AddAnnouncements = () => {
  const axiosInstance = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const announcementData = {
      authorImage: user.photoURL,
      authorName: user.displayName,
      title,
      description,
      createdAt: new Date().toISOString()
    };

    try {
      await axiosInstance.post("/announcements", announcementData);
      toast.success("Announcement added successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add announcement!");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Add Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter announcement description"
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Add Announcement
        </button>
      </form>
    </div>
  );
};

export default AddAnnouncements;
