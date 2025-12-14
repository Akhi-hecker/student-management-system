from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'students.db')  # use basedir
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    major = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'major': self.major
        }

# replace index template render (template may be missing) with a simple response
# replace index template render (template may be missing) with a simple response
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

# list students route removed to avoid conflict with page
# Use /api/students for data

# get student by id
@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get_or_404(student_id)
    return jsonify(student.to_dict()), 200

# create student
@app.route('/students', methods=['POST'])
def create_student():
    data = request.get_json() or {}
    required = ['first_name', 'last_name', 'email']
    if not all(field in data and data[field] for field in required):
        return jsonify({'error': 'first_name, last_name and email are required'}), 400
    if Student.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'email already exists'}), 400
    student = Student(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        major=data.get('major')
    )
    db.session.add(student)
    db.session.commit()
    return jsonify(student.to_dict()), 201

# update student
@app.route('/students/<int:student_id>', methods=['PUT', 'PATCH'])
def update_student(student_id):
    student = Student.query.get_or_404(student_id)
    data = request.get_json() or {}
    if 'email' in data and data['email'] != student.email:
        if Student.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'email already exists'}), 400
    student.first_name = data.get('first_name', student.first_name)
    student.last_name = data.get('last_name', student.last_name)
    student.email = data.get('email', student.email)
    student.major = data.get('major', student.major)
    db.session.commit()
    return jsonify(student.to_dict()), 200

# delete student
@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({'result': 'deleted'}), 200

# API endpoints (dedicated, unique function names)
@app.route('/api/students', methods=['POST'])
def add_student_api():
    data = request.get_json() or {}
    required = ['first_name', 'last_name', 'email']
    if not all(field in data and data[field] for field in required):
        return jsonify({'error': 'first_name, last_name and email are required'}), 400
    if Student.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'email already exists'}), 400
    new_student = Student(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        major=data.get('major')
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify(new_student.to_dict()), 201

@app.route('/api/students', methods=['GET'])
def get_students_api():
    students = Student.query.all()
    return jsonify([student.to_dict() for student in students]), 200

@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student_api(id):
    student = Student.query.get_or_404(id)
    data = request.get_json() or {}
    if 'email' in data and data['email'] != student.email:
        if Student.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'email already exists'}), 400
    student.first_name = data.get('first_name', student.first_name)
    student.last_name = data.get('last_name', student.last_name)
    student.email = data.get('email', student.email)
    student.major = data.get('major', student.major)
    db.session.commit()
    return jsonify(student.to_dict()), 200

@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student_api(id):
    student = Student.query.get_or_404(id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted successfully'}), 200

@app.route('/api/stats', methods=['GET'])
def get_stats():
    students = Student.query.all()
    total_students = len(students)
    # Count unique majors, ignoring None
    majors = set(s.major for s in students if s.major)
    total_majors = len(majors)
    
    # Get 5 recent students
    recent = [s.to_dict() for s in students[-5:][::-1]]
    
    return jsonify({
        'total_students': total_students,
        'total_majors': total_majors,
        'recent_students': recent
    }), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)