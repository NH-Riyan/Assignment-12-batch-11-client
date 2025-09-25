import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { data, Link } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";

const Banner = () => {
  const [query, setQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const axiosInstance = useAxiosSecure();
  const{user}=useContext(AuthContext)

  const { isPending, error, data: results = [] } = useQuery({
    queryKey: ["searchPosts", searchTag],
    queryFn: async () => {
      const res = await axiosInstance.get(`/post/search/${searchTag}`);
      return res.data;
    },
    enabled: !!searchTag && !!user,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTag(query.trim());
  };
 
  return (
    <section className="bg-gradient-to-r my-12 from-green-50 via-green-100 to-green-50 py-16 px-6 text-center">
     
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-gray-800">
        Welcome to{" "}
        <span className="text-green-600 italic drop-shadow-sm">CivicTalk</span>
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
        Find engaging posts and discussions tailored to your interests. Start
        exploring by searching with tags below!
      </p>

      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center gap-2 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search by tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered input-lg w-full rounded-l-lg border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          type="submit"
          className="btn btn-lg bg-green-600 hover:bg-green-700 text-white rounded-r-lg flex items-center gap-2 shadow-md transition"
        >
          <FiSearch className="w-5 h-5" />
          Search
        </button>
      </form>

   
      <div className="p-6 max-w-4xl mx-auto mt-10">
        {error && (
          <p className="text-center text-red-500 font-medium">
            Error fetching posts
          </p>
        )}
        {!isPending && !error && results.length === 0 && searchTag && (
          <p className="text-center text-gray-500">No posts found</p>
        )}

        {!isPending && results.length > 0 && (
          <ul className="space-y-5">
            {results.map((post) => (
              <li
                key={post._id}
                className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg bg-white text-left transition duration-200"
              >
                <Link to={`/posts/${post._id}`}>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {post.authorName}
                    </span>
                  </div>

                  
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-green-600 transition">
                    {post.title}
                  </h2>

                  
                  <p className="text-gray-600 mb-3">
                    {post.description?.substring(0, 120)}...
                  </p>

                
                  <p className="text-sm font-medium text-green-700">
                    🏷️ Tag:{" "}
                    <span className="bg-green-100 px-2 py-1 rounded-md text-green-800">
                      {post.tag}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

        )}
      </div>
    </section>
  );
};

export default Banner;
