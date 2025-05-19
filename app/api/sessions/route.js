// app/api/sessions/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Session from '@/models/Session';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['skill', 'learner', 'host', 'startTime', 'endTime'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new session
    const newSession = new Session({
      skill: body.skill,
      learner: body.learner,
      host: body.host,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      meetingLink: body.meetingLink || '',
      notes: body.notes || ''
    });
console.log('Session data:', {
  skill: body.skill,
  learner: body.learner,
  host: body.host,
});
console.log('Model paths:', Session.schema.paths);

    await newSession.save();

    return NextResponse.json(
      { message: 'Session created successfully', session: newSession },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create session' },
      { status: 500 }
    );
  }
}