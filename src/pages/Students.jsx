import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { FaPlus } from "react-icons/fa";
import axiosInstance from "../api/axiosConfig";
import { AnimatePresence, motion } from "framer-motion";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        birthDate: "",
        phone: "",
        parentPhone: "",
        className: "",
        direction: "",
        address: "",
        image: null, // fayl turi
    });

    // 📌 STUDENTS LIST OLISH
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axiosInstance.get("/students");
                setStudents(res.data);
            } catch (err) {
                console.log("Error fetching students:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // 📌 STUDENT QO‘SHISH
    const handleAddStudent = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            for (let key in form) {
                formData.append(key, form[key]);
            }

            const res = await axiosInstance.post("/students", formData);

            setStudents([...students, res.data]);
            setShowModal(false);
            setForm({
                fullName: "",
                birthDate: "",
                phone: "",
                parentPhone: "",
                className: "",
                direction: "",
                address: "",
                image: null,
            });
            setPreview(null);
        } catch (err) {
            console.log("Error adding student:", err);
        }
    };

    const columns = ["Full Name", "Class", "Phone"];
    const tableData = students.map((s) => ({
        fullName: s.fullName,
        className: s.className,
        phone: s.phone,
    }));

    return (
        <div className="mt-16 p-6 transition-all duration-300 dark:bg-gray-900 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
                    Students
                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-red-600 text-white shadow-lg hover:bg-red-700 px-5 py-3 rounded-xl transition-all hover:scale-105"
                >
                    <FaPlus /> Add Student
                </button>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl shadow-xl bg-white/70 dark:bg-white/10 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 transition-all">
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-20">
                        Loading students...
                    </p>
                ) : students.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-20">
                        No students found.
                    </p>
                ) : (
                    <Table columns={columns} data={tableData} />
                )}
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="backdrop-blur-2xl bg-none dark:bg-gray-800 
                                       border border-gray-100 dark:border-gray-500 
                                       shadow-2xl rounded-2xl p-6 w-[420px]"
                        >
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-gray-100">
                                Yangi o‘quvchi qo‘shish
                            </h2>

                            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                                {/* INPUTS */}
                                {[
                                    { name: "fullName", placeholder: "To‘liq ism", auto: "name" },
                                    { name: "birthDate", type: "date", placeholder: "Tug‘ilgan sana", auto: "bday" },
                                    { name: "phone", placeholder: "Telefon raqam", auto: "tel" },
                                    { name: "parentPhone", placeholder: "Ota-ona raqami", auto: "tel" },
                                    { name: "className", placeholder: "Sinfi", auto: "off" },
                                    { name: "direction", placeholder: "Yo‘nalish", auto: "off" },
                                    { name: "address", placeholder: "Manzil", auto: "street-address" },
                                ].map((input, i) => (
                                    <input
                                        key={i}
                                        type={input.type || "text"}
                                        placeholder={input.placeholder}
                                        autoComplete={input.auto}
                                        value={form[input.name]}
                                        onChange={(e) => setForm({ ...form, [input.name]: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 
                                                   text-gray-800 dark:text-gray-200 
                                                   border border-gray-100 dark:border-gray-700 shadow-sm 
                                                   focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                ))}

                                {/* IMAGE UPLOAD */}
                                <div className="flex flex-row-reverse items-start justify-between gap-2 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setForm({ ...form, image: file });
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => setPreview(reader.result);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-28 px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 
                                        text-gray-800 dark:text-gray-200 
                                        border border-gray-100 dark:border-gray-700 shadow-sm 
                                        focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-xl mt-2 border border-gray-300 dark:border-gray-600"
                                        />
                                    )}
                                </div>

                                {/* BUTTONS */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); setPreview(null); }}
                                        className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 
                                                   text-gray-700 dark:text-gray-200 
                                                   border border-gray-300 dark:border-gray-700 shadow-sm 
                                                   hover:bg-gray-300 dark:hover:bg-[#444] transition"
                                    >
                                        Bekor qilish
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl shadow-2xl shadow-red-500 
                                                   bg-red-600 text-white hover:bg-red-700 transition"
                                    >
                                        Saqlash
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Students;
