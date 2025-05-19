'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiBook, FiClock, FiUser, FiMessageSquare, FiStar } from 'react-icons/fi';

export default function DashboardWidgets({ userStats }) {
  const widgets = [
    {
      title: "Skills You're Teaching",
      value: userStats?.teachingCount || 0,
      icon: <FiBook className="text-blue-500" size={24} />,
      link: "/teach",
      color: "bg-blue-50"
    },
    {
      title: "Upcoming Sessions",
      value: userStats?.upcomingSessions || 0,
      icon: <FiClock className="text-green-500" size={24} />,
      link: "/dashboard/sessions",
      color: "bg-green-50"
    },
    {
      title: "Skills to Learn",
      value: userStats?.learningCount || 0,
      icon: <FiUser className="text-purple-500" size={24} />,
      link: "/learn",
      color: "bg-purple-50"
    },
    {
      title: "Pending Messages",
      value: userStats?.unreadMessages || 0,
      icon: <FiMessageSquare className="text-yellow-500" size={24} />,
      link: "/dashboard/messages",
      color: "bg-yellow-50"
    },
    {
      title: "Your Rating",
      value: userStats?.avgRating ? `${userStats.avgRating}/5` : "N/A",
      icon: <FiStar className="text-orange-500" size={24} />,
      link: "/dashboard/reviews",
      color: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {widgets.map((widget, index) => (
        <motion.div
          key={widget.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Link href={widget.link}>
            <div className={`${widget.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{widget.title}</p>
                  <p className="text-2xl font-bold mt-2 text-gray-900">{widget.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-white shadow-xs">
                  {widget.icon}
                </div>
              </div>
              {index === 4 && userStats?.avgRating && (
                <div className="mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${i < Math.floor(userStats.avgRating) ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}