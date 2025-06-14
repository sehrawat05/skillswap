import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const { user } = useAuth();
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedSkills, setBookmarkedSkills] = useState([]);


  useEffect(() => {
  const fetchBookmarked = async () => {
    const res = await axios.get("http://localhost:5000/api/bookmarks/bookmarked", {
  headers: { Authorization: `Bearer ${user.token}` },
});

    setBookmarkedSkills(res.data);
  };
  if (user) fetchBookmarked();
}, [user]);
 
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills");
        const allSkills = res.data;

        // Filter skills taught by this user
        const userSkills = allSkills.filter((skill) => skill.user._id === user?._id);
        setTeachingSkills(userSkills);
      } catch (err) {
    
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSkills();
  }, [user]);

  if (!user) {
    return (
      <section className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          Please log in to view your profile.
        </h2>
      </section>
    );
  }

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3 text-center">
          <img
            src={
              user?.avatar ||
              (user ? `https://i.pravatar.cc/150?u=${user.email}` : "https://i.pravatar.cc/150")
            }
            alt="avatar"
            className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Right: Skills Dashboard */}
        <div className="w-full md:w-2/3">
        {/* Skills You're Learning Section */}
<h3 className="text-lg font-semibold mt-6 mb-2">Skills You're Learning</h3>
{bookmarkedSkills.length === 0 ? (
  <p className="text-gray-500 italic">You haven't bookmarked any skills yet.</p>
) : (
  <div className="grid gap-4">
    {bookmarkedSkills.map((skill) => (
      <div
        key={skill._id}
        className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition"
      >
        <h4 className="text-xl font-semibold">{skill.name}</h4>
        <p className="text-gray-600">{skill.bio}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {skill.skills.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

          <h3 className="text-lg font-semibold mb-2">Skills You're Teaching</h3>
          {loading ? (
            <p>Loading...</p>
          ) : teachingSkills.length === 0 ? (
            <p className="text-gray-500 italic">You haven't published any skills yet.</p>
          ) : (
            <div className="grid gap-4">
              {teachingSkills.map((skill) => (
                <div
                  key={skill._id}
                  className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition"
                >
                  <h4 className="text-xl font-semibold">{skill.name}</h4>
                  <p className="text-gray-600">{skill.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skill.skills.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
