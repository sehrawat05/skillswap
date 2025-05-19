import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Skill from '@/models/Skill';
import dbConnect from '@/lib/db';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const { title, description, category, duration } = await request.json();

    // Create new skill
    const newSkill = await Skill.create({
      title,
      description,
      category,
      duration,
      teacher: session.user.id,
    });

    // Convert to plain object and transform special fields
    const skillData = {
      id: newSkill._id.toString(),
      title: newSkill.title,
      description: newSkill.description,
      category: newSkill.category,
      duration: newSkill.duration,
      teacher: newSkill.teacher.toString(),
      rating: newSkill.rating,
      reviewCount: newSkill.reviewCount,
      createdAt: newSkill.createdAt.toISOString()
    };

    return Response.json(skillData, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return Response.json(
      { message: 'Error creating skill', error: error.message },
      { status: 500 }
    );
  }
}