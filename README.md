# Student Management System

A comprehensive web-based application for managing student records, built with Python, Flask, and SQLAlchemy, featuring a modern, responsive UI.

## 📖 Description

The Student Management System is a full-stack web application designed to streamline the process of managing student data. It provides a robust RESTful API for CRUD (Create, Read, Update, Delete) operations and a user-friendly frontend interface.

Key features include:
- **Dashboard**: visualize key statistics like total students and majors, and view recent student activity.
- **Student Management**: Easily add, edit, search, and delete student records.
- **Settings**: Customize your experience with a persistent dark mode toggle.
- **Responsive Design**: Optimized for various screen sizes using modern CSS practices.

## 🛠️ Technologies Used

### Backend
* **Language:** Python 3.x
* **Framework:** Flask
* **ORM:** Flask-SQLAlchemy
* **Database:** SQLite (file-based)

### Frontend
* **HTML5:** Semantic structure with Jinja2 templating
* **CSS3:** Modern styling with variables, Flexbox, and Grid (custom `style.css`)
* **JavaScript:** Vanilla JS for dynamic interactions (AJAX requests, DOM manipulation)

## � Project Structure

```
Student Management System/
├── app.py              # Main Flask application entry point
├── students.db         # SQLite database (auto-generated)
├── static/
│   └── style.css       # Global stylesheets and themes
├── templates/
│   ├── base.html       # Base template with common layout (nav, footer)
│   ├── index.html      # Main student management page
│   ├── dashboard.html  # Statistics and recent activity dashboard
│   └── settings.html   # Application settings (e.g., Dark Mode)
└── README.md           # Project documentation
```

## �🚀 How to Get Started

### Prerequisites

* Python 3.x installed
* `pip` (Python package installer)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dragneel911/Projects.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Projects/Student\ Management\ System
    ```

3.  **Set up a Virtual Environment (Recommended):**
    * **Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    * **macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

4.  **Install Dependencies:**
    ```bash
    pip install Flask Flask-SQLAlchemy
    ```

5.  **Run the Application:**
    ```bash
    python app.py
    ```
    The application will automatically create the `students.db` database file if it doesn't exist.

6.  **Access the Application:**
    * Open your browser and go to `http://127.0.0.1:5000/` to view the **Home/Student List** page.
    * Visit `http://127.0.0.1:5000/dashboard` for the **Dashboard**.
    * Visit `http://127.0.0.1:5000/settings` for **Settings**.

## 🔌 API Endpoints

The application functionality is powered by the following REST API endpoints:

### Students
* `GET /api/students`: Retrieve a list of all students.
* `POST /api/students`: Create a new student record.
* `PUT /api/students/<id>`: Update an existing student's details.
* `DELETE /api/students/<id>`: Delete a student record.

### Statistics
* `GET /api/stats`: Retrieve summary statistics (total students, count of majors, recent additions) for the dashboard.