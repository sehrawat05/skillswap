'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TeachPage() {
  // ... (keep your existing state and handlers)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!session) {
      alert('You must be logged in to submit a skill');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          // Explicitly include only the fields you need
          title: form.title,
          description: form.description,
          category: form.category,
          duration: form.duration
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit skill');
      }

      router.push('/dashboard');
    } catch (error) {
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 via-pink-300 to-red-300 flex items-center justify-center px-4">
      <div className="bg-black/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-600 to-red-600">
          Teach a Skill
        </h1>
        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <label htmlFor="title" className="block mb-2 font-semibold text-gray-700">
            Skill Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Guitar Basics"
            className={`w-full px-5 py-3 rounded-lg border-2 transition 
              focus:outline-none focus:ring-4 focus:ring-pink-400 
              ${errors.title ? 'border-red-500' : 'border-gray-300'} mb-1`}
          />
          {errors.title && <p className="text-red-500 text-sm mb-3">{errors.title}</p>}

          {/* Description */}
          <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what you will teach"
            className={`w-full px-5 py-3 rounded-lg border-2 transition 
              focus:outline-none focus:ring-4 focus:ring-pink-400 resize-none
              ${errors.description ? 'border-red-500' : 'border-gray-300'} mb-1`}
          />
          {errors.description && <p className="text-red-500 text-sm mb-3">{errors.description}</p>}

          {/* Category */}
          <label htmlFor="category" className="block mb-2 font-semibold text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-5 py-3 rounded-lg border-2 transition 
              focus:outline-none focus:ring-4 focus:ring-pink-400
              ${errors.category ? 'border-red-500' : 'border-gray-300'} mb-1`}
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="music">Music</option>
            <option value="coding">Coding</option>
            <option value="art">Art</option>
            <option value="language">Language</option>
            <option value="fitness">Fitness</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mb-3">{errors.category}</p>}

          {/* Duration */}
          <label htmlFor="duration" className="block mb-2 font-semibold text-gray-700">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={form.duration}
            onChange={handleChange}
            className={`w-full px-5 py-3 rounded-lg border-2 transition 
              focus:outline-none focus:ring-4 focus:ring-pink-400
              ${errors.duration ? 'border-red-500' : 'border-gray-300'} mb-4`}
          />
          {errors.duration && <p className="text-red-500 text-sm mb-3">{errors.duration}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full font-bold text-white transition 
              ${isSubmitting ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 shadow-lg'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
