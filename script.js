// --- Data Models ---
const coursesData = [
  {
    id: 'course-1',
    title: 'Modern Web Development Bootcamp',
    category: 'development',
    instructor: 'Sarah Jenkins',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
    enrolled: true,
    modules: [
      {
        title: 'Module 1: HTML & CSS Fundamentals',
        lessons: [
          { id: 'm1-l1', title: '1. Course Orientation', duration: '5m', videoUrl: 'https://www.youtube.com/embed/dGcsH48486A', description: 'Welcome to the web development bootcamp. In this video, we outline the roadmap.' },
          { id: 'm1-l2', title: '2. HTML5 Semantic Elements', duration: '12m', videoUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE', description: 'Learn how to structure your web pages using semantic tags for accessibility.' }
        ]
      },
      {
        title: 'Module 2: JavaScript Mechanics',
        lessons: [
          { id: 'm2-l1', title: '3. JS Variables & Functions', duration: '18m', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', description: 'Master function definitions, ES6 arrow syntax, and scoping principles.', 
            quiz: {
              title: 'JavaScript Basics Assessment',
              questions: [
                { id: 'q1', text: 'Which keyword creates a block-scoped variable?', options: ['var', 'let', 'global'], answer: 1 }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Python Data Science Masterclass',
    category: 'data',
    instructor: 'Dr. Michael Chen',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    enrolled: true,
    modules: [
      {
        title: 'Module 1: Intro to Python',
        lessons: [
          { id: 'py-l1', title: '1. Python Environment Setup', duration: '10m', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', description: 'Installing Python, Anaconda, and setting up Jupyter Notebooks.' }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Systems & Figma',
    category: 'design',
    instructor: 'Elena Rostova',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=400',
    enrolled: false,
    modules: [
      {
        title: 'Module 1: Figma Basics',
        lessons: [
          { id: 'ux-l1', title: '1. Figma Interface & Tools', duration: '15m', videoUrl: 'https://www.youtube.com/embed/dGcsH48486A', description: 'Getting familiar with Figma workspace, frames, and components.' }
        ]
      }
    ]
  }
];

// --- App State ---
let userProgress = JSON.parse(localStorage.getItem('eduSphereProgress')) || {
  completedLessons: ['m1-l1'],
  activeCourseId: null,
  activeLessonId: null
};

// Save state to LocalStorage
function saveProgress() {
  localStorage.setItem('eduSphereProgress', JSON.stringify(userProgress));
  updateOverallProgress();
}

// --- DOM Elements ---
const navItems = document.querySelectorAll('.nav-item');
const tabViews = document.querySelectorAll('.tab-view');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const searchInput = document.getElementById('searchInput');

// --- Navigation Management ---
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetTab = item.dataset.tab;
    switchTab(targetTab);
  });
});

function switchTab(tabId) {
  navItems.forEach(i => i.classList.remove('active'));
  tabViews.forEach(v => v.classList.remove('active-view'));

  const selectedNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const selectedView = document.getElementById(tabId);

  if (selectedNav) selectedNav.classList.add('active');
  if (selectedView) selectedView.classList.add('active-view');

  renderTabContents();
}

// --- Theme Toggle ---
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  themeToggleBtn.querySelector('i').className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

// --- Dynamic Content Rendering ---
function renderTabContents() {
  renderDashboardCards();
  renderCatalogCourses('all');
  renderMyCourses();
  renderCertificates();
  updateOverallProgress();
}

function renderDashboardCards() {
  const continueContainer = document.getElementById('continueLearningContainer');
  const recommendedContainer = document.getElementById('recommendedCoursesContainer');
  
  if (!continueContainer || !recommendedContainer) return;

  const enrolled = coursesData.filter(c => c.enrolled);
  const recommended = coursesData.filter(c => !c.enrolled);

  continueContainer.innerHTML = enrolled.map(c => createCourseCardHTML(c, true)).join('');
  recommendedContainer.innerHTML = recommended.map(c => createCourseCardHTML(c, false)).join('');
  
  attachCourseCardListeners();
}

function renderCatalogCourses(category = 'all') {
  const container = document.getElementById('catalogCoursesContainer');
  if (!container) return;

  const filtered = category === 'all' 
    ? coursesData 
    : coursesData.filter(c => c.category === category);

  container.innerHTML = filtered.map(c => createCourseCardHTML(c, c.enrolled)).join('');
  attachCourseCardListeners();
}

function renderMyCourses() {
  const container = document.getElementById('myCoursesContainer');
  if (!container) return;

  const enrolled = coursesData.filter(c => c.enrolled);
  container.innerHTML = enrolled.map(c => createCourseCardHTML(c, true)).join('');
  attachCourseCardListeners();
}

function createCourseCardHTML(course, isEnrolled) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = course.modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
  }, 0);
  
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return `
    <div class="course-card" data-id="${course.id}">
      <img src="${course.thumbnail}" alt="${course.title}" class="course-thumb">
      <div class="course-body">
        <span class="course-category">${course.category}</span>
        <h4 class="course-title">${course.title}</h4>
        <p class="course-instructor">By ${course.instructor}</p>
        ${isEnrolled ? `
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="progress-text">${percent}% Complete</span>
        ` : ''}
        <div class="course-footer">
          ${isEnrolled 
            ? `<button class="btn btn-primary btn-open-course" data-id="${course.id}">Continue</button>`
            : `<button class="btn btn-secondary btn-enroll-course" data-id="${course.id}">Enroll Now</button>`
          }
        </div>
      </div>
    </div>
  `;
}

function attachCourseCardListeners() {
  document.querySelectorAll('.btn-open-course').forEach(btn => {
    btn.onclick = () => openCoursePlayer(btn.dataset.id);
  });

  document.querySelectorAll('.btn-enroll-course').forEach(btn => {
    btn.onclick = () => {
      const course = coursesData.find(c => c.id === btn.dataset.id);
      if (course) {
        course.enrolled = true;
        renderTabContents();
      }
    };
  });
}

// Filter Event Listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCatalogCourses(btn.dataset.category);
  });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const courseCards = document.querySelectorAll('.course-card');
  
  courseCards.forEach(card => {
    const title = card.querySelector('.course-title').textContent.toLowerCase();
    card.style.display = title.includes(query) ? 'flex' : 'none';
  });
});

// --- Classroom / Video Player Logic ---
function openCoursePlayer(courseId, lessonId = null) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return;

  userProgress.activeCourseId = courseId;
  const firstLesson = course.modules[0].lessons[0];
  const targetLessonId = lessonId || firstLesson.id;

  switchTab('course-player');
  document.getElementById('playerCourseTitle').textContent = course.title;
  
  renderCurriculumAccordion(course);
  loadLesson(course, targetLessonId);
}

function renderCurriculumAccordion(course) {
  const container = document.getElementById('accordionModules');
  container.innerHTML = course.modules.map(module => `
    <div class="module-group">
      <h4>${module.title}</h4>
      <ul class="lesson-list">
        ${module.lessons.map(lesson => {
          const isDone = userProgress.completedLessons.includes(lesson.id);
          return `
            <li class="lesson-item ${isDone ? 'completed' : ''}" data-lesson-id="${lesson.id}">
              <span><i class="fa-${isDone ? 'solid fa-circle-check' : 'regular fa-circle'}"></i> ${lesson.title}</span>
              <small>${lesson.duration}</small>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `).join('');

  container.querySelectorAll('.lesson-item').forEach(item => {
    item.addEventListener('click', () => {
      loadLesson(course, item.dataset.lessonId);
    });
  });

  updateCoursePlayerProgress(course);
}

function loadLesson(course, lessonId) {
  let foundLesson = null;
  course.modules.forEach(m => {
    const l = m.lessons.find(x => x.id === lessonId);
    if (l) foundLesson = l;
  });

  if (!foundLesson) return;

  userProgress.activeLessonId = foundLesson.id;

  // Active state in sidebar UI
  document.querySelectorAll('.lesson-item').forEach(i => {
    i.classList.toggle('active', i.dataset.lessonId === foundLesson.id);
  });

  // Load Iframe Video and Text Details
  document.getElementById('videoPlayer').src = foundLesson.videoUrl;
  document.getElementById('currentLessonTitle').textContent = foundLesson.title;
  document.getElementById('currentLessonDescription').textContent = foundLesson.description;

  // Update Mark Completed Button State
  const markCompleteBtn = document.getElementById('markCompleteBtn');
  const isCompleted = userProgress.completedLessons.includes(foundLesson.id);
  markCompleteBtn.innerHTML = isCompleted 
    ? `<i class="fa-solid fa-check-double"></i> Completed` 
    : `<i class="fa-solid fa-check"></i> Mark as Completed`;

  markCompleteBtn.onclick = () => toggleLessonCompletion(course, foundLesson.id);

  // Setup Quiz if present
  setupQuiz(foundLesson);
}

function toggleLessonCompletion(course, lessonId) {
  const index = userProgress.completedLessons.indexOf(lessonId);
  if (index > -1) {
    userProgress.completedLessons.splice(index, 1);
  } else {
    userProgress.completedLessons.push(lessonId);
  }
  
  saveProgress();
  renderCurriculumAccordion(course);
  loadLesson(course, lessonId);
}

function updateCoursePlayerProgress(course) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = course.modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
  }, 0);

  const percent = Math.round((completedCount / totalLessons) * 100);
  document.getElementById('playerProgressBar').style.width = `${percent}%`;
  document.getElementById('playerProgressText').textContent = `${percent}% Completed`;
}

// --- Quiz System ---
function setupQuiz(lesson) {
  const quizContainer = document.getElementById('quizContainer');
  const quizContent = document.getElementById('quizContent');
  const quizResult = document.getElementById('quizResult');

  if (!lesson.quiz) {
    quizContainer.classList.add('hidden');
    return;
  }

  quizContainer.classList.remove('hidden');
  quizResult.classList.add('hidden');

  quizContent.innerHTML = lesson.quiz.questions.map((q, idx) => `
    <div class="quiz-question" data-qidx="${idx}">
      <p><strong>Q${idx + 1}: ${q.text}</strong></p>
      <div class="quiz-options">
        ${q.options.map((opt, oIdx) => `
          <label>
            <input type="radio" name="question_${idx}" value="${oIdx}">
            ${opt}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('submitQuizBtn').onclick = () => {
    let score = 0;
    lesson.quiz.questions.forEach((q, idx) => {
      const selected = document.querySelector(`input[name="question_${idx}"]:checked`);
      if (selected && parseInt(selected.value) === q.answer) {
        score++;
      }
    });

    const passed = score === lesson.quiz.questions.length;
    quizResult.className = `quiz-result ${passed ? 'passed' : 'failed'}`;
    quizResult.textContent = passed 
      ? `🎉 Congratulations! You passed with ${score}/${lesson.quiz.questions.length}` 
      : `❌ You scored ${score}/${lesson.quiz.questions.length}. Please review the material and try again.`;
    
    quizResult.classList.remove('hidden');
  };
}

document.getElementById('backToCoursesBtn').onclick = () => {
  document.getElementById('videoPlayer').src = ''; // stop video
  switchTab('my-learning');
};

// --- Certificates Management ---
function renderCertificates() {
  const container = document.getElementById('certificatesContainer');
  if (!container) return;

  const completedCourses = coursesData.filter(course => {
    const total = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = course.modules.reduce((acc, m) => {
      return acc + m.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
    }, 0);
    return total > 0 && total === completed;
  });

  if (completedCourses.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary);">No certificates earned yet. Complete all lessons in a course to unlock!</p>`;
    return;
  }

  container.innerHTML = completedCourses.map(c => `
    <div class="cert-card">
      <i class="fa-solid fa-award"></i>
      <h3>${c.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.5rem 0 1rem;">Verified Completion</p>
      <button class="btn btn-primary btn-view-cert" data-title="${c.title}">View Certificate</button>
    </div>
  `).join('');

  document.querySelectorAll('.btn-view-cert').forEach(btn => {
    btn.onclick = () => showCertificateModal(btn.dataset.title);
  });
}

const modal = document.getElementById('certificateModal');
const closeModal = document.querySelector('.close-modal');

function showCertificateModal(courseTitle) {
  document.getElementById('certCourseTitle').textContent = courseTitle;
  document.getElementById('certDate').textContent = new Date().toLocaleDateString();
  modal.classList.remove('hidden');
}

closeModal.onclick = () => modal.classList.add('hidden');
window.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };

document.getElementById('downloadCertBtn').onclick = () => {
  window.print();
};

// --- Progress Metrics ---
function updateOverallProgress() {
  let totalLessonsSum = 0;
  coursesData.filter(c => c.enrolled).forEach(c => {
    c.modules.forEach(m => totalLessonsSum += m.lessons.length);
  });

  const completedCount = userProgress.completedLessons.length;
  const overallPercent = totalLessonsSum > 0 ? Math.round((completedCount / totalLessonsSum) * 100) : 0;

  const progressBar = document.getElementById('overallProgressBar');
  const progressText = document.getElementById('overallProgressText');
  
  if (progressBar && progressText) {
    progressBar.style.width = `${Math.min(overallPercent, 100)}%`;
    progressText.textContent = `${Math.min(overallPercent, 100)}% Completed`;
  }

  const statEnrolled = document.getElementById('statEnrolled');
  const statCompleted = document.getElementById('statCompleted');
  if (statEnrolled) statEnrolled.textContent = coursesData.filter(c => c.enrolled).length;
  if (statCompleted) {
    const completedCourses = coursesData.filter(c => {
      const total = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const done = c.modules.reduce((acc, m) => acc + m.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length, 0);
      return total > 0 && total === done;
    }).length;
    statCompleted.textContent = completedCourses;
  }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  renderTabContents();
});