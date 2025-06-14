
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SkillForm = () => {
    const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    avatar: "",
  });
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/skills", {
        ...form,
        skills: form.skills.split(",").map(s => s.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Skill Published Successfully!");
      navigate("/profile");
    } catch (err) {
     
      alert("Failed to publish skill");
    }
  };
  return (
    <section className="max-w-xl mx-auto mt-10 bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Publish a Skill</h2>
        <form action="" onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Your name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full border px-3 py-2 rounded" required/>
             <textarea
          placeholder="Your Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />
        <input
          type="text"
          placeholder="Skills (fill a different form for each skill)"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />

                <input
          type="text"
          placeholder="Avatar Image URL (optional)"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Publish Skill
        </button>

        </form>
    </section>
  )
}

export default SkillForm
