
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardWidgets from "@/components/DashboardWidgets";
import SkillCard from "@/components/SkillCard";
import SessionCard from "@/components/SessionCard";
import ReviewCard from "@/components/ReviewCard";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import Skill from "@/models/Skill";
import Review from "@/models/Review";
import DashboardClient from "./DashboardClient";
import Link from "next/link";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();

  // Fetch data
  const currentUser = await User.findById(session.user.id).lean();

  const [skills, sessions, reviews, stats] = await Promise.all([
    Skill.find({
      $or: [
        { teacher: currentUser._id },
        { category: { $in: currentUser.interests || [] } },
      ],
    })
      .populate("teacher", "name image")
      .limit(6)
      .lean(),

    Session.find({
      $or: [{ host: currentUser._id }, { learner: currentUser._id }],
      startTime: { $gte: new Date() },
    })
      .populate("host", "name")
      .populate("learner", "name")
      .populate("skill", "title")
      .sort({ startTime: 1 })
      .limit(4)
      .lean(),

    Review.find({
      $or: [{ teacher: currentUser._id }, { learner: currentUser._id }],
    })
      .populate("learner", "name image")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),

    Promise.all([
      Skill.countDocuments({ teacher: currentUser._id }),
      Session.countDocuments({
        $or: [{ host: currentUser._id }, { learner: currentUser._id }],
        startTime: { $gte: new Date() },
      }),
      Session.countDocuments({
        learner: currentUser._id,
        endTime: { $lt: new Date() },
      }),
      Review.aggregate([
        { $match: { teacher: currentUser._id } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]).then((result) => result[0]?.avgRating?.toFixed(1) || 0),
    ]),
  ]);

  const userStats = {
    teachingCount: stats[0],
    upcomingSessions: stats[1],
    learningCount: stats[2],
    avgRating: stats[3],
    unreadMessages: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back,{" "}
            <span className="text-indigo-600">{currentUser.name}</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's your activity summary</p>

          {/* Date and quick actions */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                New Session
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="animate-stagger mb-12">
          <DashboardWidgets userStats={userStats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
            <section className="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Sessions
                </h2>
                <a
                  href="/sessions"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  View all
                </a>
              </div>

              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <SessionCard
                      key={session._id.toString()}
                      session={{
                        ...session,
                        id: session._id.toString(),
                        skill: session.skill, // Direct string value
                        host: session.host, // Direct string value
                        learner: session.learner, // Direct string value
                      }}
                      isHost={session.host === currentUser.email}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No upcoming sessions scheduled
                  </p>

                  <Link href="/sessions">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      Schedule a Session
                    </button>
                  </Link>
                </div>
              )}
            </section>

            {/* Recommended Skills */}
            <section className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recommended Skills
                </h2>
                <a
                  href="/skills"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Browse all
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <SkillCard
                      key={skill._id.toString()}
                      skill={{
                        ...skill,
                        _id: skill._id.toString(),
                        createdAt: skill.createdAt.toISOString(),

                        teacher: {
                          id: skill.teacher._id.toString(),
                          name: skill.teacher.name,
                          image: skill.teacher.image,
                        },
                      }}
                      showTeacher={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No skills recommended yet</p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                      Explore Skills
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Reviews */}
            <section className="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Reviews
                </h2>
                <a
                  href="/reviews"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  See all
                </a>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id.toString()}
                      review={{
                        ...review,
                        id: review._id.toString(),
                        reviewer: {
                          name: review.reviewer.name,
                          image: review.reviewer.image,
                        },
                        session: {
                          skill: review.session?.skill || "Unknown Skill",
                          date: review.createdAt,
                        },
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                  <span>Create a New Skill</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <span>View Messages</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <span>Edit Profile</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </section>

            {/* Activity Feed */}
            <section className="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        New session request
                      </p>
                      <p className="text-sm text-gray-500">From Jane Cooper</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
