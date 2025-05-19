// app/sessions/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiLink, FiUser, FiBookmark, FiEdit3 } from 'react-icons/fi';

export default function ScheduleSessionPage() {
  const router = useRouter(); // Initialize router
  const [form, setForm] = useState({
    skill: '',
    learner: '',
    host: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.skill) return 'Skill is required';
    if (!form.learner) return 'Learner is required';
    if (!form.host) return 'Host is required';
    if (!form.startTime) return 'Start time is required';
    if (!form.endTime) return 'End time is required';
    
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    
    if (end <= start) {
      return 'End time must be after start time';
    }
    
    return '';
  };

  
// Add this function to refresh the dashboard data
const refreshDashboard = () => {
  // This tells Next.js to revalidate the dashboard page
  fetch('/api/revalidate?path=/dashboard', { method: 'POST' });
};

// Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

  setIsSubmitting(true);
  setError('');
  
  try {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to schedule session');
    }

    // Refresh dashboard data before redirecting
    await refreshDashboard();
    router.push('/dashboard');
    router.refresh(); // Force a refresh of the dashboard page
  } catch (err) {
    setError(err.message || 'An unexpected error occurred');
    console.error('Submission error:', err);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Schedule a New Session
          </h1>
          <p className="text-lg text-gray-600">
            Fill in the details to create a learning session
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {/* Skill Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBookmark className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="skill"
                    name="skill"
                    placeholder="Skill (e.g. 'Advanced Guitar')"
                    value={form.skill}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Learner Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="learner"
                    name="learner"
                    placeholder="Learner Email"
                    value={form.learner}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Host Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="host"
                    name="host"
                    placeholder="Host Email"
                    value={form.host}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Time Picker Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-500 pl-10">Start Time</label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="h-5 w-5 text-gray-400" />
                    </div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-500 pl-10">End Time</label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Meeting Link */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLink className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="meetingLink"
                    name="meetingLink"
                    placeholder="Meeting URL (optional)"
                    value={form.meetingLink}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Notes */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FiEdit3 className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Session notes (optional)"
                    rows={4}
                    value={form.notes}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 focus:border-green-500 focus:outline-none text-lg resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-all duration-200 transform hover:scale-[1.01] shadow-lg`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scheduling...
                    </span>
                  ) : (
                    'Schedule Session'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}