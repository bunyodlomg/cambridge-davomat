import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MdClose, MdSearch, MdPersonAdd, MdPersonRemove, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const Api = import.meta.env.VITE_API_URL.slice(0) || "http://localhost:5000";
const studentImgApi = Api.slice(0, -4);

export default function StudentAddModal({
    group,
    allStudents,
    currentGroupStudents,
    onClose,
    onAddStudents,
    onRemoveStudents
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("available");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedCurrentStudents, setSelectedCurrentStudents] = useState([]);
    const [localCurrentStudents, setLocalCurrentStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(null);
    const [loadingStudentId, setLoadingStudentId] = useState(null);

    // Reflar
    const addMultipleButtonRef = useRef(null);
    const removeMultipleButtonRef = useRef(null);

    // CurrentGroupStudents ni kuzatish va yangilash
    useEffect(() => {

        const processStudents = async () => {
            if (currentGroupStudents.length > 0) {
                // Agar string IDlar bo'lsa
                if (typeof currentGroupStudents[0] === 'string') {
                    const fullStudents = currentGroupStudents
                        .map(studentId => {
                            const student = allStudents.find(s => s._id === studentId);
                            if (!student) {
                                console.warn(`⚠️ Student not found for ID: ${studentId}`);
                            }
                            return student;
                        })
                        .filter(student => student !== undefined);

                    setLocalCurrentStudents(fullStudents);
                }
                // Agar object bo'lsa
                else if (currentGroupStudents[0] && currentGroupStudents[0]._id) {
                    setLocalCurrentStudents(currentGroupStudents);
                }
                // Agar aralash bo'lsa
                else {
                    const processedStudents = currentGroupStudents.map(item => {
                        if (typeof item === 'string') {
                            return allStudents.find(s => s._id === item);
                        }
                        return item;
                    }).filter(item => item && item._id);

                    setLocalCurrentStudents(processedStudents);
                }
            } else {
                setLocalCurrentStudents([]);
            }
        };

        processStudents();
    }, [currentGroupStudents, allStudents]);


    // Guruhda mavjud bo'lmagan studentlar
    const availableStudents = useMemo(() => {
        const currentStudentIds = new Set(localCurrentStudents.map(s => s._id));

        const filtered = allStudents.filter(student =>
            !currentStudentIds.has(student._id) &&
            student.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered;
    }, [allStudents, localCurrentStudents, searchTerm]);

    // Guruhda mavjud studentlar (qidiruvga mos)
    const currentStudents = useMemo(() => {
        const filtered = localCurrentStudents.filter(student =>
            student.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered;
    }, [localCurrentStudents, searchTerm]);

    // Bitta studentni tanlash
    const toggleSelectStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    // Guruhdagi bitta studentni tanlash
    const toggleSelectCurrentStudent = (studentId) => {
        setSelectedCurrentStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    // Barchasini tanlash/ochirish
    const toggleSelectAll = () => {
        if (selectedStudents.length === availableStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(availableStudents.map(s => s._id));
        }
    };

    // Guruhdagi barchasini tanlash/ochirish
    const toggleSelectAllCurrent = () => {
        if (selectedCurrentStudents.length === currentStudents.length) {
            setSelectedCurrentStudents([]);
        } else {
            setSelectedCurrentStudents(currentStudents.map(s => s._id));
        }
    };

    // Birdaniga bir nechta student qo'shish
    const handleAddMultiple = async () => {
        if (selectedStudents.length === 0 || isLoading) return;


        setIsLoading(true);
        setLoadingType('add-multiple');

        try {
            const updatedGroup = await onAddStudents(selectedStudents);

            if (updatedGroup) {

                // Yangilangan studentlarni local state'ga o'tkazish
                if (updatedGroup.students && Array.isArray(updatedGroup.students)) {
                    const updatedStudents = updatedGroup.students
                        .map(student => {
                            if (typeof student === 'string') {
                                return allStudents.find(s => s._id === student);
                            }
                            return student;
                        })
                        .filter(student => student !== undefined);

                    setLocalCurrentStudents(updatedStudents);

                    // Force re-render for availableStudents
                    setSearchTerm(prev => prev + ' ');
                    setTimeout(() => {
                        setSearchTerm(prev => prev.trim());
                    }, 10);
                }

                // Tanlangan studentlarni tozalash
                setSelectedStudents([]);

                // Qisqa kutish
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                console.warn("⚠️ No updated group returned from onAddStudents");
            }
        } catch (error) {
            console.error("❌ Error in handleAddMultiple:", error);
        } finally {
            setIsLoading(false);
            setLoadingType(null);
        }
    };

    // Birdaniga bir nechta student o'chirish
    const handleRemoveMultiple = async () => {
        if (selectedCurrentStudents.length === 0 || isLoading) return;


        setIsLoading(true);
        setLoadingType('remove-multiple');

        try {
            const updatedGroup = await onRemoveStudents(selectedCurrentStudents);

            if (updatedGroup) {

                // Yangilangan studentlarni local state'ga o'tkazish
                if (updatedGroup.students) {
                    const updatedStudents = updatedGroup.students
                        .map(student => {
                            if (typeof student === 'string') {
                                return allStudents.find(s => s._id === student);
                            }
                            return student;
                        })
                        .filter(student => student !== undefined);

                    setLocalCurrentStudents(updatedStudents);
                } else {
                    // Agar studentlar string ID bo'lsa
                    setLocalCurrentStudents(prev =>
                        prev.filter(s => !selectedCurrentStudents.includes(s._id))
                    );
                }

                // Force re-render for currentStudents
                setSearchTerm(prev => prev + ' ');
                setTimeout(() => {
                    setSearchTerm(prev => prev.trim());
                }, 10);

                // Tanlangan studentlarni tozalash
                setSelectedCurrentStudents([]);

                // Qisqa kutish
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                console.warn("⚠️ No updated group returned from onRemoveStudents");
            }
        } catch (error) {
            console.error("❌ Error in handleRemoveMultiple:", error);
        } finally {
            setIsLoading(false);
            setLoadingType(null);
        }
    };

    // Bitta student qo'shish
    const handleAddSingleStudent = async (studentId, event) => {
        if (isLoading) return;


        setIsLoading(true);
        setLoadingType('add-single');
        setLoadingStudentId(studentId);

        if (event) {
            event.stopPropagation();
        }

        try {
            const updatedGroup = await onAddStudents([studentId]);

            if (updatedGroup && updatedGroup.students) {

                // Yangilangan studentlarni local state'ga o'tkazish
                const updatedStudents = updatedGroup.students
                    .map(id => {
                        if (typeof id === 'string') {
                            return allStudents.find(s => s._id === id);
                        }
                        return id;
                    })
                    .filter(student => student !== undefined);

                setLocalCurrentStudents(updatedStudents);

                // Force re-render
                setSearchTerm(prev => prev + ' ');
                setTimeout(() => {
                    setSearchTerm(prev => prev.trim());
                }, 10);
            }
        } catch (error) {
            console.error("❌ Error in handleAddSingleStudent:", error);
        } finally {
            setIsLoading(false);
            setLoadingType(null);
            setLoadingStudentId(null);
        }
    };

    // Bitta student o'chirish
    const handleRemoveSingleStudent = async (studentId, event) => {
        if (isLoading) return;

        setIsLoading(true);
        setLoadingType('remove-single');
        setLoadingStudentId(studentId);

        if (event) {
            event.stopPropagation();
        }

        try {
            const updatedGroup = await onRemoveStudents([studentId]);

            if (updatedGroup) {
                // Yangilangan studentlarni local state'ga o'tkazish
                if (updatedGroup.students) {
                    const updatedStudents = updatedGroup.students
                        .map(id => {
                            if (typeof id === 'string') {
                                return allStudents.find(s => s._id === id);
                            }
                            return id;
                        })
                        .filter(student => student !== undefined);

                    setLocalCurrentStudents(updatedStudents);
                } else {
                    // Agar studentlar string ID bo'lsa
                    setLocalCurrentStudents(prev =>
                        prev.filter(s => s._id !== studentId)
                    );
                }

                // Force re-render
                setSearchTerm(prev => prev + ' ');
                setTimeout(() => {
                    setSearchTerm(prev => prev.trim());
                }, 10);

                // Agar tanlanganlar orasida bo'lsa, uni olib tashlash
                setSelectedCurrentStudents(prev =>
                    prev.filter(id => id !== studentId)
                );
            }
        } catch (error) {
            console.error("❌ Error in handleRemoveSingleStudent:", error);
        } finally {
            setIsLoading(false);
            setLoadingType(null);
            setLoadingStudentId(null);
        }
    };

    // Tab o'zgarganda tanlovlarni tozalash
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedStudents([]);
        setSelectedCurrentStudents([]);
    };

    // Loading spinner komponenti
    const LoadingSpinner = () => (
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    );

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="backdrop-blur-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {group.name} - O'quvchilar boshqaruvi
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {localCurrentStudents.length} ta o'quvchi • {group.time} • {group.days.join(', ')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "available"
                            ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isLoading && handleTabChange("available")}
                        disabled={isLoading}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <MdPersonAdd size={16} />
                            Mavjud o'quvchilar ({availableStudents.length})
                        </div>
                    </button>
                    <button
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "current"
                            ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isLoading && handleTabChange("current")}
                        disabled={isLoading}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <MdPersonRemove size={16} />
                            Guruhdagi o'quvchilar ({currentStudents.length})
                        </div>
                    </button>
                </div>

                {/* Search va Actions */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="O'quvchi ismi bo'yicha qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Action buttons */}
                    {activeTab === "available" && selectedStudents.length > 0 && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {selectedStudents.length === availableStudents.length ? (
                                    <MdCheckBox size={20} />
                                ) : (
                                    <MdCheckBoxOutlineBlank size={20} />
                                )}
                                Barchasini {selectedStudents.length === availableStudents.length ? "ochirish" : "tanlash"}
                            </button>
                            <button
                                ref={addMultipleButtonRef}
                                onClick={handleAddMultiple}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || selectedStudents.length === 0}
                            >
                                {loadingType === 'add-multiple' ? (
                                    <>
                                        <LoadingSpinner />
                                        Qo'shilyapti...
                                    </>
                                ) : (
                                    <>
                                        <MdPersonAdd size={18} />
                                        {selectedStudents.length} ta o'quvchi qo'shish
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {activeTab === "current" && selectedCurrentStudents.length > 0 && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={toggleSelectAllCurrent}
                                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {selectedCurrentStudents.length === currentStudents.length ? (
                                    <MdCheckBox size={20} />
                                ) : (
                                    <MdCheckBoxOutlineBlank size={20} />
                                )}
                                Barchasini {selectedCurrentStudents.length === currentStudents.length ? "ochirish" : "tanlash"}
                            </button>
                            <button
                                ref={removeMultipleButtonRef}
                                onClick={handleRemoveMultiple}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || selectedCurrentStudents.length === 0}
                            >
                                {loadingType === 'remove-multiple' ? (
                                    <>
                                        <LoadingSpinner />
                                        O'chirilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <MdPersonRemove size={18} />
                                        {selectedCurrentStudents.length} ta o'quvchi o'chirish
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Students List */}
                <div className="overflow-y-auto max-h-[45vh] p-4">
                    {isLoading && loadingType && (
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3">
                                    <LoadingSpinner />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {loadingType === 'add-multiple' && `${selectedStudents.length} ta o'quvchi qo'shilyapti...`}
                                        {loadingType === 'remove-multiple' && `${selectedCurrentStudents.length} ta o'quvchi o'chirilmoqda...`}
                                        {loadingType === 'add-single' && "O'quvchi qo'shilyapti..."}
                                        {loadingType === 'remove-single' && "O'quvchi o'chirilmoqda..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "available" ? (
                        <>
                            {availableStudents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {availableStudents.map(student => {
                                        const isSelected = selectedStudents.includes(student._id);
                                        const isThisStudentLoading = loadingType === 'add-single' && loadingStudentId === student._id;

                                        return (
                                            <div
                                                key={student._id}
                                                className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${isSelected
                                                    ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                                                    : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"
                                                    } ${isThisStudentLoading ? 'opacity-50' : ''}`}
                                                onClick={() => !isLoading && toggleSelectStudent(student._id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center">
                                                        {isSelected ? (
                                                            <MdCheckBox className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
                                                        ) : (
                                                            <MdCheckBoxOutlineBlank className="text-gray-400 mr-2" size={20} />
                                                        )}
                                                    </div>
                                                    {student.image ? (
                                                        <img
                                                            src={`${studentImgApi}${student.image}`}
                                                            alt={student.fullName}
                                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                                                {(student.fullName || "?")[0]}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {student.fullName}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {student.className} • {student.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        if (!isLoading) {
                                                            handleAddSingleStudent(student._id, e);
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isLoading || isThisStudentLoading}
                                                >
                                                    {isThisStudentLoading ? (
                                                        <div className="w-6 h-4 flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-700"></div>
                                                        </div>
                                                    ) : (
                                                        "Qo'shish"
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">👨‍🎓</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm
                                            ? "Qidiruv natijasiga mos o'quvchilar topilmadi"
                                            : "Barcha o'quvchilar allaqachon bu guruhda"
                                        }
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {currentStudents.length > 0 ? (
                                <div className="space-y-3">
                                    {currentStudents.map(student => {
                                        const isSelected = selectedCurrentStudents.includes(student._id);
                                        const isThisStudentLoading = loadingType === 'remove-single' && loadingStudentId === student._id;

                                        return (
                                            <div
                                                key={student._id}
                                                className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${isSelected
                                                    ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-500"
                                                    : "bg-gray-50 dark:bg-gray-800 border-2 border-transparent"
                                                    } ${isThisStudentLoading ? 'opacity-50' : ''}`}
                                                onClick={() => !isLoading && toggleSelectCurrentStudent(student._id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center">
                                                        {isSelected ? (
                                                            <MdCheckBox className="text-red-600 dark:text-red-400 mr-2" size={20} />
                                                        ) : (
                                                            <MdCheckBoxOutlineBlank className="text-gray-400 mr-2" size={20} />
                                                        )}
                                                    </div>
                                                    {student.image ? (
                                                        <img
                                                            src={`${studentImgApi}${student.image}`}
                                                            alt={student.fullName}
                                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                                                {(student.fullName || "?")[0]}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {student.fullName}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {student.className} • {student.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        if (!isLoading) {
                                                            handleRemoveSingleStudent(student._id, e);
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isLoading || isThisStudentLoading}
                                                >
                                                    {isThisStudentLoading ? (
                                                        <div className="w-6 h-4 flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700"></div>
                                                        </div>
                                                    ) : (
                                                        "O'chirish"
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">👥</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Bu guruhda hozircha o'quvchilar yo'q
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {activeTab === "available"
                                ? selectedStudents.length > 0
                                    ? `${selectedStudents.length} ta o'quvchi tanlandi`
                                    : `${availableStudents.length} ta o'quvchi guruhga qo'shilishi mumkin`
                                : selectedCurrentStudents.length > 0
                                    ? `${selectedCurrentStudents.length} ta o'quvchi tanlandi`
                                    : `${currentStudents.length} ta o'quvchi guruhda`
                            }
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Yopish
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}