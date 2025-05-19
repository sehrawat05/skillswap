'use client';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiUser, FiMessageSquare, FiVideo } from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export default function SessionCard({ session, isHost = false }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
    >
      {/* Session Header */}
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{session.skill.title}</h3>
            <p className="text-sm text-gray-500">
              {isHost ? 'With learner: ' : 'With teacher: '}
              <span className="font-medium text-gray-700">
                {isHost ? session.learner.name : session.host.name}
              </span>
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[session.status] || 'bg-gray-100 text-gray-800'}`}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Session Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-400" />
            <span className="text-sm text-gray-700">
              {dayjs(session.date).format('MMM Do, YYYY')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="text-gray-400" />
            <span className="text-sm text-gray-700">
              {dayjs(session.startTime).format('h:mm A')} - {dayjs(session.endTime).format('h:mm A')}
            </span>
          </div>
        </div>

        {/* Session Description */}
        {session.notes && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{session.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {session.status === 'confirmed' && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"
            >
              <FiVideo className="mr-2" />
              Join Session
            </motion.a>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
          >
            <FiMessageSquare className="mr-2" />
            Message
          </motion.button>

          {(session.status === 'pending' && isHost) && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg"
              >
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg"
              >
                Decline
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <FiClock className="text-gray-400" size={14} />
          <span className="text-xs text-gray-500">
            {dayjs(session.createdAt).fromNow()}
          </span>
        </div>
        {session.status === 'completed' && !session.reviewed && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Leave Review
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}