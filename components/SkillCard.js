'use client';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiUser, FiBookmark, FiMessageCircle } from 'react-icons/fi';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function SkillCard({ skill, showTeacher = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Skill Image/Placeholder */}
      <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden">
        {skill.image ? (
          <img 
            src={skill.image} 
            alt={skill.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FiBookmark className="text-gray-300" size={48} />
          </div>
        )}
        
        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-xs">
          {skill.category}
        </span>
      </div>

      {/* Skill Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            <Link href={`/skills/${skill.id}`} className="hover:text-blue-600 transition-colors">
              {skill.title}
            </Link>
          </h3>
          
          {/* Bookmark Button */}
          <button className="text-gray-400 hover:text-yellow-500 transition-colors">
            <FiBookmark className={skill.isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {skill.description}
        </p>

        {/* Skill Metadata */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <FiClock className="text-gray-400" />
              <span>{skill.duration} min session</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
              <span className="font-medium text-gray-700">
                {skill.rating || 'New'}
              </span>
              <span className="text-gray-400">({skill.reviewCount || 0})</span>
            </div>
          </div>

          {/* Teacher Info */}
          {showTeacher && skill.teacher && (
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
              <div className="flex-shrink-0">
                {skill.teacher.image ? (
                  <img 
                    src={skill.teacher.image} 
                    alt={skill.teacher.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiUser className="text-gray-400" size={14} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {skill.teacher.name}
                </p>
                <p className="text-xs text-gray-500">
                  {skill.sessionCount || 0} sessions
                </p>
              </div>
              <Link 
                href={`/message/${skill.teacher.id}`}
                className="ml-auto text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FiMessageCircle />
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Added {dayjs(skill.createdAt).fromNow()}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"
            >
              Book Session
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}