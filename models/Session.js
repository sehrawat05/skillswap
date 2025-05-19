// models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  skill: { 
    type: String, // Changed to String type
    required: [true, 'Skill is required'] 
  },
  learner: { 
    type: String, // Changed to String type
    required: [true, 'Learner is required'] 
  },
  host: { 
    type: String, // Changed to String type
    required: [true, 'Host is required']
  },
  startTime: { 
    type: Date, 
    required: [true, 'Start time is required'] 
  },
  endTime: { 
    type: Date, 
    required: [true, 'End time is required'],
    validate: {
      validator: function(value) {
        return value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  meetingLink: { 
    type: String, 
    default: '' 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);