document.addEventListener('DOMContentLoaded', () => {
    // Shared State & Utilities
    const API_STUDENTS = '/api/students';
    const API_STATS = '/api/stats';
    const pageId = window.PAGE_ID || 'unknown';

    // --- Toast Logic (Global) ---
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        let icon = type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill';
        let color = type === 'success' ? '#22c55e' : '#ef4444';

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="${icon}" style="color: ${color}; font-size: 1.2rem;"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Dark Mode Logic (Global) ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    function setDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', enabled);
        if (darkModeToggle) darkModeToggle.checked = enabled;
    }

    // Initialize Dark Mode
    setDarkMode(isDarkMode);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            setDarkMode(e.target.checked);
        });
    }

    // ================= PAGE SPECIFIC LOGIC =================

    // --- STUDENTS PAGE ---
    if (pageId === 'students') {
        initStudentsPage();
    }

    function initStudentsPage() {
        const studentForm = document.getElementById('student-form');
        const studentList = document.getElementById('student-list');
        const studentIdInput = document.getElementById('student-id');
        const searchInput = document.getElementById('search-input');
        const modalOverlay = document.getElementById('modal-overlay');
        const openAddModalBtn = document.getElementById('open-add-modal');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const modalTitle = document.getElementById('modal-title');
        const emptyState = document.getElementById('empty-state');
        const submitButton = document.getElementById('submit-button');

        let studentsData = [];

        // Modals
        function openModal(isEdit = false) {
            modalTitle.textContent = isEdit ? 'Edit Student' : 'Add New Student';
            submitButton.textContent = isEdit ? 'Update Student' : 'Save Student';
            modalOverlay.classList.remove('hidden');
            if (!isEdit) {
                studentForm.reset();
                studentIdInput.value = '';
            }
        }

        function closeModal() {
            modalOverlay.classList.add('hidden');
        }

        if (openAddModalBtn) openAddModalBtn.addEventListener('click', () => openModal(false));

        closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
        }

        // Fetching
        async function fetchStudents() {
            try {
                const response = await fetch(API_STUDENTS);
                if (!response.ok) throw new Error('Failed to fetch');
                studentsData = await response.json();
                renderStudents(studentsData);
            } catch (error) {
                console.error(error);
                showToast('Failed to load students', 'error');
            }
        }

        function renderStudents(students) {
            studentList.innerHTML = '';
            if (students.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            } else {
                emptyState.classList.add('hidden');
            }

            students.forEach(student => {
                const row = document.createElement('tr');
                const initials = `${student.first_name[0] || ''}${student.last_name[0] || ''}`.toUpperCase();

                row.innerHTML = `
                    <td>
                        <div class="name-cell">
                            <div class="student-initials">${initials}</div>
                            <div>
                                <div style="font-weight: 500;">${student.first_name} ${student.last_name}</div>
                            </div>
                        </div>
                    </td>
                    <td>${student.email}</td>
                    <td>${student.major || '-'}</td>
                    <td style="color: var(--text-secondary); font-size: 0.85rem;">#${student.id}</td>
                    <td class="text-right">
                        <button class="action-btn edit-btn" data-id="${student.id}" title="Edit">
                            <i class="ri-pencil-line"></i>
                        </button>
                        <button class="action-btn delete delete-btn" data-id="${student.id}" title="Delete">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </td>
                `;
                studentList.appendChild(row);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = studentsData.filter(student =>
                    student.first_name.toLowerCase().includes(term) ||
                    student.last_name.toLowerCase().includes(term) ||
                    student.email.toLowerCase().includes(term) ||
                    (student.major && student.major.toLowerCase().includes(term))
                );
                renderStudents(filtered);
            });
        }

        if (studentForm) {
            studentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = studentIdInput.value;
                const studentData = {
                    first_name: document.getElementById('first_name').value,
                    last_name: document.getElementById('last_name').value,
                    email: document.getElementById('email').value,
                    major: document.getElementById('major').value,
                };
                const isEdit = !!id;
                const url = isEdit ? `${API_STUDENTS}/${id}` : API_STUDENTS;
                const method = isEdit ? 'PUT' : 'POST';

                const originalBtnText = submitButton.textContent;
                submitButton.textContent = 'Saving...';
                submitButton.disabled = true;

                try {
                    const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(studentData),
                    });
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error || 'Failed to save');
                    }
                    showToast(isEdit ? 'Updated successfully' : 'Added successfully');
                    closeModal();
                    fetchStudents();
                } catch (error) {
                    showToast(error.message, 'error');
                } finally {
                    submitButton.textContent = originalBtnText;
                    submitButton.disabled = false;
                }
            });
        }

        if (studentList) {
            studentList.addEventListener('click', async (e) => {
                const btn = e.target.closest('.action-btn');
                if (!btn) return;
                const id = btn.dataset.id;
                if (btn.classList.contains('delete-btn')) {
                    if (!confirm('Are you sure?')) return;
                    try {
                        const response = await fetch(`${API_STUDENTS}/${id}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error('Failed to delete');
                        showToast('Student removed');
                        fetchStudents();
                    } catch (error) {
                        showToast('Failed to delete', 'error');
                    }
                }
                if (btn.classList.contains('edit-btn')) {
                    const student = studentsData.find(s => s.id == id);
                    if (student) {
                        document.getElementById('first_name').value = student.first_name;
                        document.getElementById('last_name').value = student.last_name;
                        document.getElementById('email').value = student.email;
                        document.getElementById('major').value = student.major;
                        studentIdInput.value = student.id;
                        openModal(true);
                    }
                }
            });
        }

        fetchStudents();
    }

    // --- DASHBOARD PAGE ---
    if (pageId === 'dashboard') {
        initDashboardPage();
    }

    function initDashboardPage() {
        async function fetchStats() {
            try {
                const response = await fetch(API_STATS);
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();

                document.getElementById('total-students').textContent = data.total_students;
                document.getElementById('total-majors').textContent = data.total_majors;

                const recentList = document.getElementById('recent-students-list');
                recentList.innerHTML = '';
                data.recent_students.forEach(s => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${s.first_name} ${s.last_name}</td>
                        <td>${s.email}</td>
                        <td>${s.major || '-'}</td>
                    `;
                    recentList.appendChild(row);
                });
            } catch (error) {
                console.error(error);
                showToast('Could not load dashboard data', 'error');
            }
        }
        fetchStats();
    }
});