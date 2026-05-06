import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Calendar, BarChart3, Settings, BookOpen, ListTodo, Clock, TrendingUp, Target, Award, Flame, Download, RotateCcw, Moon, Sun } from 'lucide-react';

export default function StudyPlanner() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [subjectForm, setSubjectForm] = useState({ name: '', color: '#FF6B6B', priority: 'medium' });
  const [taskForm, setTaskForm] = useState({ title: '', subject: '', deadline: '', priority: 'medium', completed: false });
  const [scheduleForm, setScheduleForm] = useState({ day: 'Monday', subject: '', startTime: '09:00', endTime: '10:00' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const priorities = ['high', 'medium', 'low'];
  const colorOptions = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  useEffect(() => {
    const saved = localStorage.getItem('studyPlannerData');
    if (saved) {
      const data = JSON.parse(saved);
      setSubjects(data.subjects || []);
      setTasks(data.tasks || []);
      setSchedule(data.schedule || []);
      setDarkMode(data.darkMode || false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyPlannerData', JSON.stringify({ subjects, tasks, schedule, darkMode }));
  }, [subjects, tasks, schedule, darkMode]);

  const addSubject = () => {
    if (subjectForm.name.trim()) {
      if (editingSubject) {
        setSubjects(subjects.map(s => s.id === editingSubject ? { ...subjectForm, id: editingSubject } : s));
        setEditingSubject(null);
      } else {
        setSubjects([...subjects, { ...subjectForm, id: Date.now() }]);
      }
      setSubjectForm({ name: '', color: '#FF6B6B', priority: 'medium' });
      setShowSubjectForm(false);
    }
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setTasks(tasks.filter(t => t.subjectId !== id));
    setSchedule(schedule.filter(sch => sch.subjectId !== id));
  };

  const editSubject = (subject) => {
    setSubjectForm({ name: subject.name, color: subject.color, priority: subject.priority });
    setEditingSubject(subject.id);
    setShowSubjectForm(true);
  };

  const addTask = () => {
    if (taskForm.title.trim() && taskForm.subject) {
      const subjectId = subjects.find(s => s.name === taskForm.subject)?.id;
      if (editingTask) {
        setTasks(tasks.map(t => t.id === editingTask ? { ...taskForm, subjectId, id: editingTask } : t));
        setEditingTask(null);
      } else {
        setTasks([...tasks, { ...taskForm, subjectId, id: Date.now() }]);
      }
      setTaskForm({ title: '', subject: '', deadline: '', priority: 'medium', completed: false });
      setShowTaskForm(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const editTask = (task) => {
    const subjectName = subjects.find(s => s.id === task.subjectId)?.name || '';
    setTaskForm({ title: task.title, subject: subjectName, deadline: task.deadline, priority: task.priority, completed: task.completed });
    setEditingTask(task.id);
    setShowTaskForm(true);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addSchedule = () => {
    if (scheduleForm.subject && scheduleForm.startTime && scheduleForm.endTime) {
      const subjectId = subjects.find(s => s.name === scheduleForm.subject)?.id;
      if (editingSchedule) {
        setSchedule(schedule.map(sch => sch.id === editingSchedule ? { ...scheduleForm, subjectId, id: editingSchedule } : sch));
        setEditingSchedule(null);
      } else {
        setSchedule([...schedule, { ...scheduleForm, subjectId, id: Date.now() }]);
      }
      setScheduleForm({ day: 'Monday', subject: '', startTime: '09:00', endTime: '10:00' });
      setShowScheduleForm(false);
    }
  };

  const deleteSchedule = (id) => {
    setSchedule(schedule.filter(sch => sch.id !== id));
  };

  const editSchedule = (sch) => {
    const subjectName = subjects.find(s => s.id === sch.subjectId)?.name || '';
    setScheduleForm({ day: sch.day, subject: subjectName, startTime: sch.startTime, endTime: sch.endTime });
    setEditingSchedule(sch.id);
    setShowScheduleForm(true);
  };

  const exportData = () => {
    const data = { subjects, tasks, schedule };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-planner-data.json';
    a.click();
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      setSubjects([]);
      setTasks([]);
      setSchedule([]);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'pending') return !task.completed;
    if (taskFilter === 'completed') return task.completed;
    return true;
  });

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  
  const today = new Date();
  const upcomingDeadlines = tasks
    .filter(t => !t.completed && t.deadline)
    .map(t => ({ ...t, daysLeft: Math.ceil((new Date(t.deadline) - today) / (1000 * 60 * 60 * 24)) }))
    .filter(t => t.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const overdueTasks = tasks.filter(t => !t.completed && t.deadline && new Date(t.deadline) < today).length;

  const subjectPerformance = subjects.map(subject => {
    const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
    const completed = subjectTasks.filter(t => t.completed).length;
    const total = subjectTasks.length;
    return {
      name: subject.name,
      color: subject.color,
      completion: total > 0 ? Math.round((completed / total) * 100) : 0,
      total
    };
  });

  const totalStudyHours = schedule.reduce((acc, sch) => {
    const start = new Date(`2000-01-01T${sch.startTime}`);
    const end = new Date(`2000-01-01T${sch.endTime}`);
    return acc + (end - start) / (1000 * 60 * 60);
  }, 0);

  const mostProductiveSubject = subjectPerformance.reduce((max, subj) => 
    subj.completion > (max?.completion || 0) ? subj : max, null);

  const productivityScore = Math.round((completionRate * 0.5) + ((subjects.length > 0 ? 1 : 0) * 20) + (Math.min(totalStudyHours / 40, 1) * 30));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Archivo:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Archivo', sans-serif;
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }

        .dark .app-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .main-content {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 2rem 1.5rem;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .dark .sidebar {
          background: rgba(30, 30, 50, 0.95);
        }

        .logo {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dark .logo {
          background: linear-gradient(135deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          margin-bottom: 0.5rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #4a5568;
        }

        .dark .nav-item {
          color: #a0aec0;
        }

        .nav-item:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .page-header {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 2rem;
          animation: slideDown 0.6s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 1.75rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease backwards;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dark .stat-card {
          background: rgba(30, 30, 50, 0.95);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-label {
          font-size: 0.875rem;
          color: #718096;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .dark .stat-label {
          color: #a0aec0;
        }

        .stat-value {
          font-family: 'Poppins', sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          animation: fadeInUp 0.6s ease;
        }

        .dark .card {
          background: rgba(30, 30, 50, 0.95);
        }

        .card-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .dark .card-title {
          color: #e2e8f0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .btn-secondary {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .dark .btn-secondary {
          background: rgba(102, 126, 234, 0.2);
          color: #a5b4fc;
        }

        .btn-secondary:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .btn-icon {
          padding: 0.625rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
          color: #667eea;
        }

        .btn-icon:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.1);
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .dark .form-label {
          color: #cbd5e0;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
          color: #2d3748;
        }

        .dark .form-input {
          background: rgba(45, 55, 72, 0.5);
          border-color: rgba(102, 126, 234, 0.3);
          color: #e2e8f0;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .subject-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          margin-bottom: 1rem;
          border-left: 4px solid;
          transition: all 0.3s ease;
        }

        .subject-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .priority-badge {
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-high {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .priority-medium {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .priority-low {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .task-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .task-item:hover {
          background: rgba(102, 126, 234, 0.08);
        }

        .task-checkbox {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 2px solid #667eea;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .task-checkbox.completed {
          background: linear-gradient(135deg, #667eea, #764ba2);
          position: relative;
        }

        .task-checkbox.completed::after {
          content: '✓';
          color: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
        }

        .task-content {
          flex: 1;
        }

        .task-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .dark .task-title {
          color: #e2e8f0;
        }

        .task-title.completed {
          text-decoration: line-through;
          opacity: 0.6;
        }

        .task-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #718096;
        }

        .schedule-grid {
          display: grid;
          gap: 1rem;
        }

        .schedule-day {
          background: rgba(102, 126, 234, 0.05);
          padding: 1.25rem;
          border-radius: 12px;
        }

        .schedule-day-title {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .schedule-slot {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem;
          background: white;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          border-left: 3px solid;
        }

        .dark .schedule-slot {
          background: rgba(45, 55, 72, 0.5);
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .color-picker {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
        }

        .color-option:hover {
          transform: scale(1.1);
        }

        .color-option.selected {
          border-color: white;
          box-shadow: 0 0 0 2px #667eea;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .dark .modal {
          background: #1e1e32;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
        }

        .dark .modal-title {
          color: #e2e8f0;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 10px;
          margin-bottom: 0.75rem;
        }

        .days-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .days-badge.safe {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .performance-item {
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 10px;
          margin-bottom: 0.75rem;
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .performance-name {
          font-weight: 600;
          color: #2d3748;
        }

        .dark .performance-name {
          color: #e2e8f0;
        }

        .performance-percentage {
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #718096;
        }

        .empty-icon {
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .toggle-switch {
          width: 56px;
          height: 28px;
          background: #cbd5e0;
          border-radius: 14px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-switch.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .toggle-slider {
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 12px;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-slider {
          left: 30px;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(102, 126, 234, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            padding: 1rem;
          }
          
          .main-content {
            flex-direction: column;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .page-header {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="main-content">
          <div className="sidebar">
            <div className="logo">
              <Flame size={32} />
              StudyFlow
            </div>
            <nav>
              <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <Target size={20} />
                Dashboard
              </div>
              <div className={`nav-item ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => setActiveTab('subjects')}>
                <BookOpen size={20} />
                Subjects
              </div>
              <div className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
                <ListTodo size={20} />
                Tasks
              </div>
              <div className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
                <Calendar size={20} />
                Schedule
              </div>
              <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                <BarChart3 size={20} />
                Analytics
              </div>
              <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <Settings size={20} />
                Settings
              </div>
            </nav>
          </div>

          <div className="content-area">
            {activeTab === 'dashboard' && (
              <>
                <h1 className="page-header">Dashboard</h1>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Subjects</div>
                    <div className="stat-value">{subjects.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Pending Tasks</div>
                    <div className="stat-value">{pendingTasks}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Completion %</div>
                    <div className="stat-value">{completionRate}%</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Study Hours/Week</div>
                    <div className="stat-value">{totalStudyHours.toFixed(1)}</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Upcoming Deadlines</div>
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map(task => (
                      <div key={task.id} className="deadline-item">
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{task.title}</div>
                          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {subjects.find(s => s.id === task.subjectId)?.name}
                          </div>
                        </div>
                        <div className={`days-badge ${task.daysLeft > 7 ? 'safe' : ''}`}>
                          {task.daysLeft === 0 ? 'Today' : `${task.daysLeft}d left`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <Calendar size={48} className="empty-icon" />
                      <div>No upcoming deadlines</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'subjects' && (
              <>
                <h1 className="page-header">Subjects</h1>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="card-title" style={{ marginBottom: 0 }}>Your Subjects</div>
                    <button className="btn btn-primary" onClick={() => setShowSubjectForm(true)}>
                      <Plus size={20} />
                      Add Subject
                    </button>
                  </div>

                  {subjects.length > 0 ? (
                    subjects.map(subject => (
                      <div key={subject.id} className="subject-item" style={{ borderLeftColor: subject.color }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: subject.color }}></div>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{subject.name}</div>
                            <span className={`priority-badge priority-${subject.priority}`}>{subject.priority}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-icon" onClick={() => editSubject(subject)}>
                            <Edit2 size={18} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteSubject(subject.id)} style={{ color: '#ef4444' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <BookOpen size={48} className="empty-icon" />
                      <div>No subjects yet. Add your first subject!</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'tasks' && (
              <>
                <h1 className="page-header">Tasks</h1>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="card-title" style={{ marginBottom: 0 }}>Your Tasks</div>
                    <button className="btn btn-primary" onClick={() => setShowTaskForm(true)} disabled={subjects.length === 0}>
                      <Plus size={20} />
                      Add Task
                    </button>
                  </div>

                  <div className="filter-buttons">
                    <button className={`filter-btn ${taskFilter === 'all' ? 'active' : ''}`} onClick={() => setTaskFilter('all')}>
                      All
                    </button>
                    <button className={`filter-btn ${taskFilter === 'pending' ? 'active' : ''}`} onClick={() => setTaskFilter('pending')}>
                      Pending
                    </button>
                    <button className={`filter-btn ${taskFilter === 'completed' ? 'active' : ''}`} onClick={() => setTaskFilter('completed')}>
                      Completed
                    </button>
                  </div>

                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <div key={task.id} className="task-item">
                        <div className={`task-checkbox ${task.completed ? 'completed' : ''}`} onClick={() => toggleTask(task.id)}></div>
                        <div className="task-content">
                          <div className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</div>
                          <div className="task-meta">
                            <span>{subjects.find(s => s.id === task.subjectId)?.name}</span>
                            {task.deadline && <span>📅 {new Date(task.deadline).toLocaleDateString()}</span>}
                            <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-icon" onClick={() => editTask(task)}>
                            <Edit2 size={18} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteTask(task.id)} style={{ color: '#ef4444' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <ListTodo size={48} className="empty-icon" />
                      <div>No tasks found. {subjects.length === 0 ? 'Add subjects first!' : 'Add your first task!'}</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'schedule' && (
              <>
                <h1 className="page-header">Weekly Schedule</h1>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="card-title" style={{ marginBottom: 0 }}>Time Slots</div>
                    <button className="btn btn-primary" onClick={() => setShowScheduleForm(true)} disabled={subjects.length === 0}>
                      <Plus size={20} />
                      Add Slot
                    </button>
                  </div>

                  <div className="schedule-grid">
                    {days.map(day => {
                      const daySchedule = schedule.filter(s => s.day === day);
                      return (
                        <div key={day} className="schedule-day">
                          <div className="schedule-day-title">{day}</div>
                          {daySchedule.length > 0 ? (
                            daySchedule.map(slot => {
                              const subject = subjects.find(s => s.id === slot.subjectId);
                              return (
                                <div key={slot.id} className="schedule-slot" style={{ borderLeftColor: subject?.color }}>
                                  <Clock size={18} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{subject?.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                                      {slot.startTime} - {slot.endTime}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => editSchedule(slot)}>
                                      <Edit2 size={16} />
                                    </button>
                                    <button className="btn-icon" onClick={() => deleteSchedule(slot.id)} style={{ color: '#ef4444' }}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ fontSize: '0.875rem', color: '#718096', padding: '0.5rem' }}>No classes scheduled</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'analytics' && (
              <>
                <h1 className="page-header">Analytics</h1>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Overall Completion</div>
                    <div className="stat-value">{completionRate}%</div>
                    <div className="progress-bar" style={{ marginTop: '1rem' }}>
                      <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Study Hours This Week</div>
                    <div className="stat-value">{totalStudyHours.toFixed(1)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Overdue Tasks</div>
                    <div className="stat-value">{overdueTasks}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Productivity Score</div>
                    <div className="stat-value">{productivityScore}</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Subject Performance</div>
                  {subjectPerformance.length > 0 ? (
                    subjectPerformance.map(subj => (
                      <div key={subj.name} className="performance-item">
                        <div className="performance-header">
                          <span className="performance-name">{subj.name}</span>
                          <span className="performance-percentage">{subj.completion}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${subj.completion}%`, background: subj.color }}></div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
                          {subj.total} total tasks
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <TrendingUp size={48} className="empty-icon" />
                      <div>No data to analyze yet</div>
                    </div>
                  )}
                </div>

                {mostProductiveSubject && (
                  <div className="card">
                    <div className="card-title">Most Productive Subject</div>
                    <div className="performance-item">
                      <div className="performance-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Award size={24} style={{ color: '#f59e0b' }} />
                          <span className="performance-name">{mostProductiveSubject.name}</span>
                        </div>
                        <span className="performance-percentage">{mostProductiveSubject.completion}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <h1 className="page-header">Settings</h1>
                <div className="card">
                  <div className="card-title">Preferences</div>
                  <div className="settings-item">
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Dark Mode</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>Switch between light and dark theme</div>
                    </div>
                    <div className={`toggle-switch ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(!darkMode)}>
                      <div className="toggle-slider">
                        {darkMode ? <Moon size={16} style={{ margin: '4px' }} /> : <Sun size={16} style={{ margin: '4px' }} />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Data Management</div>
                  <div className="settings-item">
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Export Data</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>Download your study planner data</div>
                    </div>
                    <button className="btn btn-secondary" onClick={exportData}>
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                  <div className="settings-item">
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Reset Data</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>Clear all subjects, tasks, and schedule</div>
                    </div>
                    <button className="btn btn-danger" onClick={resetData}>
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {showSubjectForm && (
          <div className="modal-overlay" onClick={() => { setShowSubjectForm(false); setEditingSubject(null); setSubjectForm({ name: '', color: '#FF6B6B', priority: 'medium' }); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
                <button className="btn-icon" onClick={() => { setShowSubjectForm(false); setEditingSubject(null); setSubjectForm({ name: '', color: '#FF6B6B', priority: 'medium' }); }}>
                  <X size={24} />
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div className="color-picker">
                  {colorOptions.map(color => (
                    <div
                      key={color}
                      className={`color-option ${subjectForm.color === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setSubjectForm({ ...subjectForm, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={subjectForm.priority}
                  onChange={(e) => setSubjectForm({ ...subjectForm, priority: e.target.value })}
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={addSubject}>
                {editingSubject ? 'Update Subject' : 'Add Subject'}
              </button>
            </div>
          </div>
        )}

        {showTaskForm && (
          <div className="modal-overlay" onClick={() => { setShowTaskForm(false); setEditingTask(null); setTaskForm({ title: '', subject: '', deadline: '', priority: 'medium', completed: false }); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
                <button className="btn-icon" onClick={() => { setShowTaskForm(false); setEditingTask(null); setTaskForm({ title: '', subject: '', deadline: '', priority: 'medium', completed: false }); }}>
                  <X size={24} />
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g., Complete Chapter 5"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-input"
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={addTask}>
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        )}

        {showScheduleForm && (
          <div className="modal-overlay" onClick={() => { setShowScheduleForm(false); setEditingSchedule(null); setScheduleForm({ day: 'Monday', subject: '', startTime: '09:00', endTime: '10:00' }); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingSchedule ? 'Edit Slot' : 'Add Schedule Slot'}</h2>
                <button className="btn-icon" onClick={() => { setShowScheduleForm(false); setEditingSchedule(null); setScheduleForm({ day: 'Monday', subject: '', startTime: '09:00', endTime: '10:00' }); }}>
                  <X size={24} />
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Day</label>
                <select
                  className="form-input"
                  value={scheduleForm.day}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-input"
                  value={scheduleForm.subject}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={addSchedule}>
                {editingSchedule ? 'Update Slot' : 'Add Slot'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
