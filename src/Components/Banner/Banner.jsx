import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";

const Banner = () => {
 const [query, setQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // TanStack Query using object syntax
  const { isPending, error, data: results = [] } = useQuery({
    queryKey: ["searchPosts", searchTag],
    // queryFn: () =>
    //   fetch(`http://localhost:5000/api/posts/search?tag=${searchTag}`).then((res) =>
    //     res.json()
    //   ),
    enabled: !!searchTag, // only fetch when searchTag is not empty
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTag(query.trim());
  };

  return (
    <section className="bg-green-100 py-12 px-4 text-center">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4">
        Welcome to <span className="text-green-600 italic">CivicTalk</span>
      </h1>
      <p className="text-lg mb-8">Find posts and discussions based on your interests!</p>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center gap-2 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search by tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered input-lg w-full rounded-r-none focus:outline-green-500"
        />
        <button
          type="submit"
          className="btn btn-lg btn-green rounded-l-none flex items-center gap-2"
        >
          <FiSearch className="w-5 h-5" />
          Search
        </button>
      </form>

      {/* Search Results */}
      <div className="p-4 max-w-4xl mx-auto mt-8">
        {isPending && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">Error fetching posts</p>}
        {!isPending && !error && results.length === 0 && searchTag && (
          <p className="text-center text-gray-500">No posts found</p>
        )}
        {!isPending && results.length > 0 && (
          <ul className="space-y-4">
            {results.map((post) => (
              <li
                key={post._id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-400 mt-1">
                  Tags: {post.tags.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Banner;