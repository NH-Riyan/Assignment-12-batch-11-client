import React from 'react';

const Tags = () => {
  const tags = ["Technology", "Politics", "Education", "Sports", "General"];

  return (
    <div className="p-6 bg-gray-50 ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tags You can search for </h2>

      <div className="flex flex-wrap gap-4">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tags;
