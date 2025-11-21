import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { FaPlus } from "react-icons/fa";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", subjects: "" });

    useEffect(() => {
        setTeachers([
            { name: "Oybek", phone: "123456789", subjects: "Math, Physics" },
            { name: "Nilufar", phone: "987654321", subjects: "English, History" },
        ]);
        setLoading(false);
    }, []);

    const handleAddTeacher = (e) => {
        e.preventDefault();
        setTeachers([...teachers, form]);
        setForm({ name: "", phone: "", subjects: "" });
        setShowModal(false);
    };

    const columns = ["Name", "Phone", "Subjects"];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                    <FaPlus /> Add Teacher
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
                {loading ? (
                    <p className="text-gray-500 text-center py-20">Loading teachers...</p>
                ) : teachers.length === 0 ? (
                    <p className="text-gray-500 text-center py-20">No teachers yet.</p>
                ) : (
                    <Table columns={columns} data={teachers} />
                )}
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
                <form className="flex flex-col gap-4" onSubmit={handleAddTeacher}>
                    <input
                        type="text"
                        placeholder="Name"
                        className="border rounded-xl px-4 py-2"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        className="border rounded-xl px-4 py-2"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subjects"
                        className="border rounded-xl px-4 py-2"
                        value={form.subjects}
                        onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
                        Add Teacher
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Teachers;
