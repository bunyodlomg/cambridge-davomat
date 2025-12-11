import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNotification } from "../components/Notification";
import Loader from "../components/Loader";
import StudentFilters from "../components/Students/StudentFilters";
import StudentFormModal from "../components/Students/StudentFormModal";
import StudentsTable from "../components/Students/StudentsTable";
import { MdAdd, MdSearch, MdFilterList } from "react-icons/md";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const URL = import.meta.env.VITE_API_URL
    const studentImgURL = URL.slice(0, URL.length - 4);

    const { show } = useNotification();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/students");
            setStudents(res.data);
            setFilteredStudents([]);
            setHasSearched(false);
        } catch (error) {
            show({ type: "error", message: "O'quvchilarni yuklashda xatolik!" });
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (filters) => {
        let result = [...students];

        const isEmptyFilter = !filters.search && !filters.classNumber && !filters.className && !filters.group;

        if (isEmptyFilter) {
            setFilteredStudents([]);
            setHasSearched(false);
            return;
        }

        setHasSearched(true);

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(student =>
                student.fullName?.toLowerCase().includes(searchTerm) ||
                student.phone?.includes(filters.search) ||
                student.parentPhone?.includes(filters.search) ||
                student.address?.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.classNumber) {
            result = result.filter(student => {
                if (!student.className) return false;
                const classNum = student.className.match(/^(\d+)/);
                return classNum && parseInt(classNum[1]) === parseInt(filters.classNumber);
            });
        }

        if (filters.className) {
            result = result.filter(student => student.className === filters.className);
        }

        if (filters.group) {
            result = result.filter(student =>
                student.groups?.some(g =>
                    (typeof g === 'object' ? g._id === filters.group : g === filters.group)
                )
            );
        }

        setFilteredStudents(result);
    };

    const handleSubmit = async (formData) => {
        try {
            const endpoint = editingStudent
                ? `/students/${editingStudent._id}`
                : "/students";

            const method = editingStudent ? "put" : "post";

            await axiosInstance[method](endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            show({
                type: "success",
                message: editingStudent
                    ? "O'quvchi yangilandi!"
                    : "Yangi o'quvchi qo'shildi!"
            });

            fetchStudents();
            setShowModal(false);
            setEditingStudent(null);
            return true;
        } catch (error) {
            show({
                type: "error",
                message: error.response?.data?.message || "Xatolik yuz berdi!"
            });
            return false;
        }
    };

    const handleDeleteClick = (studentId) => {
        const student = students.find(s => s._id === studentId);
        setSelectedStudent(student);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedStudent) return;

        try {
            await axiosInstance.delete(`/students/${selectedStudent._id}`);
            show({ type: "success", message: "O'quvchi o'chirildi!" });
            fetchStudents();
        } catch (error) {
            console.error("Delete error:", error);
            if (error.response?.status === 404) {
                show({ type: "error", message: "O'quvchi topilmadi!" });
            } else {
                show({ type: "error", message: "O'chirishda xatolik!" });
            }
        } finally {
            setDeleteModal(false);
            setSelectedStudent(null);
        }
    };

    const showAllStudents = () => {
        setFilteredStudents(students);
        setHasSearched(true);
    };

    if (loading) return <Loader />;

    return (
        <div className="p-4 md:p-6 mt-10">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                                O'quvchilar
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Barcha o'quvchilarni boshqarish
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {!hasSearched && (
                            <button
                                onClick={showAllStudents}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                            >
                                <MdFilterList size={18} />
                                <span className="hidden sm:inline">Hammasini ko'rish</span>
                                <span className="sm:hidden">Hammasi</span>
                            </button>
                        )}

                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                        >
                            <MdAdd size={18} />
                            <span className="hidden sm:inline">Yangi o'quvchi</span>
                            <span className="sm:hidden">Yangi</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Responsive */}

            </div>

            {/* Filters */}
            <div className="mb-6">
                <StudentFilters
                    onFilter={handleFilter}
                    students={students}
                />
            </div>

            {/* Content Area */}
            {!hasSearched ? (
                <div className="text-center py-12 md:py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="max-w-md mx-auto px-4">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                            <MdSearch className="text-5xl text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            O'quvchilarni toping
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            O'quvchilarni ko'rish uchun yuqoridagi filtrlardan foydalaning yoki barcha o'quvchilarni ko'rish uchun tugmani bosing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={showAllStudents}
                                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                Barcha o'quvchilarni ko'rish
                            </button>
                            <button
                                onClick={() => {
                                    const firstClassName = [...new Set(students
                                        .map(s => s.className)
                                        .filter(Boolean)
                                    )][0];
                                    if (firstClassName) {
                                        handleFilter({ className: firstClassName });
                                    }
                                }}
                                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors"
                            >
                                Sinf bo'yicha qidirish
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Results Header */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <MdSearch className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Natijalar
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {filteredStudents.length} ta o'quvchi topildi
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setFilteredStudents([]);
                                    setHasSearched(false);
                                }}
                                className="px-4 py-2 text-sm bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                Filtrlarni tozalash
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <StudentsTable
                        students={filteredStudents}
                        onEdit={(student) => {
                            setEditingStudent(student);
                            setShowModal(true);
                        }}
                        onDelete={handleDeleteClick}
                    />
                </>
            )}

            {/* Modals */}
            {showModal && (
                <StudentFormModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditingStudent(null);
                    }}
                    onSubmit={handleSubmit}
                    initialData={editingStudent}
                    isEditing={!!editingStudent}
                />
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="backdrop-blur-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">
                                O'chirishni tasdiqlaysizmi?
                            </h2>

                            {selectedStudent && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        {selectedStudent.image ? (
                                            <img
                                                src={`${studentImgURL + selectedStudent.image}`}
                                                alt={selectedStudent.fullName}
                                                className="w-12 h-12 rounded-full border-2 border-red-300"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
                                                <span className="text-red-600 font-bold text-lg">
                                                    {(selectedStudent.fullName || "?")[0]}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {selectedStudent.fullName}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {selectedStudent.className} • {selectedStudent.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Bu o'quvchi ma'lumotlari butunlay o'chiriladi va tiklanmaydi.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all"
                                    onClick={() => setDeleteModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 transition-all"
                                    onClick={handleDeleteConfirm}
                                >
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}