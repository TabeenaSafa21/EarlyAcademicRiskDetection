import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import FacultyDashboard from './pages/FacultyDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';
import type { StudentFeedback, WellnessMessage } from './types';

type View = 'login' | 'faculty' | 'parent' | 'student';

export default function App() {
  const [view, setView] = useState<View>('login');
  const [parentStudentId, setParentStudentId] = useState('');
  const [wellnessMessages, setWellnessMessages] = useState<WellnessMessage[]>([]);
  const [studentFeedback, setStudentFeedback] = useState<StudentFeedback[]>([]);

  if (view === 'faculty') {
    return (
      <FacultyDashboard
        wellnessMessages={wellnessMessages}
        studentFeedback={studentFeedback}
        onLogout={() => setView('login')}
      />
    );
  }

  if (view === 'parent') {
    return <ParentDashboard studentId={parentStudentId} onLogout={() => setView('login')} />;
  }

  if (view === 'student') {
    return (
      <StudentDashboard
        studentId={parentStudentId}
        onLogout={() => setView('login')}
        onWellnessMessage={message => setWellnessMessages(current => [message, ...current])}
        onFeedback={feedback => setStudentFeedback(current => [feedback, ...current])}
      />
    );
  }

  return (
    <LoginPage
      onFacultyLogin={() => setView('faculty')}
      onParentLogin={id => { setParentStudentId(id); setView('parent'); }}
      onStudentLogin={id => { setParentStudentId(id); setView('student'); }}
    />
  );
}
