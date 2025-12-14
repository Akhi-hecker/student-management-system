# Student Management System (Flask API)

A simple REST API for managing student records, built with Python, Flask, and SQLAlchemy.

## 📖 Description

This project is a lightweight, web-based Student Management System. It provides a RESTful API for performing CRUD (Create, Read, Update, Delete) operations on student data. The application uses Flask for the web framework, SQLAlchemy as the ORM, and SQLite for a simple, file-based database.

It also serves a basic `index.html` page which can be used to interact with the API.

## 🛠️ Technologies Used

* **Backend:** Python
* **Framework:** Flask
* **ORM:** Flask-SQLAlchemy
* **Database:** SQLite

## 🚀 How to Get Started

### Prerequisites

* Python 3.x
* `pip` (Python package installer)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dragneel911/Projects.git](https://github.com/dragneel911/Projects.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Projects/Student\ Management\ System
    ```
3.  **Create and activate a virtual environment:**
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
4.  **Install the required packages:**
    ```bash
    pip install Flask Flask-SQLAlchemy
    ```
    *(**Note:** For a best-practice project, you can save these dependencies to a file by running `pip freeze > requirements.txt` and then install them in the future with `pip install -r requirements.txt`)*

5.  **Run the application:**
    *(Assuming your Python file is named `app.py`)*
    ```bash
    python app.py
    ```
    The application will start in debug mode. The script automatically creates the `students.db` SQLite database file in the project directory if it doesn't exist.

6.  **Access the application:**
    * **Web Interface:** `http://127.0.0.1:5000/`
    * **API:** `http://127.0.0.1:5000/api/students`

## API Endpoints

The API provides the following endpoints for managing student records:

### `GET /api/students`

* **Description:** Retrieves a list of all students.
* **Success Response (200):**
    ```json
    [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "major": "Computer Science"
      }
    ]
    ```

### `POST /api/students`

* **Description:** Creates a new student.
* **Request Body (JSON):**
    ```json
    {
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "major": "Biology"
    }
    ```
* **Success Response (201):**
    ```json
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "major": "Biology"
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: If `first_name`, `last_name`, or `email` are missing.
    * `400 Bad Request`: If the `email` already exists.

### `PUT /api/students/<int:id>`

* **Description:** Updates an existing student's information.
* **Request Body (JSON):**
    ```json
    {
      "major": "Marine Biology"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "major": "Marine Biology"
    }
    ```
* **Error Responses:**
    * `404 Not Found`: If the student `id` does not exist.
    * `400 Bad Request`: If the new `email` (if provided) already exists for another user.

### `DELETE /api/students/<int:id>`

* **Description:** Deletes a student by their ID.
* **Success Response (200):**
    ```json
    {
      "message": "Student deleted successfully"
    }
    ```
* **Error Response:**
    * `404 Not Found`: If the student `id` does not exist.