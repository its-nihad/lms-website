EduSphere - Modern Learning Management System (LMS)

EduSphere is a lightweight, fully functional Learning Management System built using pure HTML, CSS, and Vanilla JavaScript. It provides interactive course tracking, video lesson playback, quiz assessments, dynamic course filtering, dark/light theme switching, and automated certificate generation with local storage persistence.



Features

- Dashboard & Analytics: View enrolled courses, completion statistics, hours spent, and progress tracking.
- Course Catalog & Search: Browse available courses filterable by categories (Development, Data Science, Design) with real-time text search.
- Interactive Classroom: Integrated video lesson player with module step-by-step accordion navigation.
- Quizzes & Assessments: Interactive lesson quizzes with automated grading and feedback.
- Certificate Generator: Automatically awards downloadable/printable certificates upon 100% course completion.
- Dark / Light Theme: Built-in theme switcher powered by CSS variables.
- State Persistence: Uses browser `localStorage` to save user course progress automatically.



 Project Structure

```text
edusphere-lms/
├── index.html     # Main HTML structural layout
├── style.css      # Custom UI styles and CSS variables (Light/Dark mode)
├── script.js     # Course data, routing state logic, interactive elements
└── README.md      # Build and deployment instructions