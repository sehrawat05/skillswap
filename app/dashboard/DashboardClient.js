'use client';

import SkillCard from '@/components/SkillCard';

export default function DashboardClient({ skills }) {
  return (
    <div className="dashboard-container">
      <h1>Your Skills</h1>
      <div className="skills-grid">
        {skills.length > 0 ? (
          skills.map(skill => (
            <SkillCard 
              key={skill.id} 
              skill={skill}
            />
          ))
        ) : (
          <p>No skills found. Create your first skill!</p>
        )}
      </div>
    </div>
  );
}