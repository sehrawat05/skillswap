import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Explore() {
  const [skills, setSkills] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills");
        // Only show skills published by other users
        const filtered = res.data.filter(skill => skill.user._id !== user._id);
        setSkills(filtered);
      } catch (err) {
       
      }
    };

    if (user) fetchSkills();
  }, [user]);

  const handleBookmark = async (skillId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookmarks/bookmark/${skillId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Skill bookmarked successfully!");
    } catch (error) {

      alert("Something went wrong while bookmarking.");
    }
  };

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🌟 Explore Skills</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img
                src={skill.image || "https://source.unsplash.com/400x200/?learning"}
                alt={skill.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={skill.avatar || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {skill.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{skill.bio}</p>
              </div>
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                {skill.skills.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleBookmark(skill._id)}
                className="m-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                📌 Bookmark
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No skills available to explore yet.
          </p>
        )}
      </div>
    </section>
  );
}
