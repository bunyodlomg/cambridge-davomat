import { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { FaPlus } from "react-icons/fa";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", surname: "", class: "", phone: "" });

    useEffect(() => {
        // fetch students from backend
        setStudents([
            { name: "Ali", surname: "Valiyev", class: "5A", phone: "123456789" },
            { name: "Sara", surname: "Xolmatova", class: "6B", phone: "987654321" },
        ]);
        setLoading(false);
    }, []);

    const handleAddStudent = (e) => {
        e.preventDefault();
        setStudents([...students, form]);
        setForm({ name: "", surname: "", class: "", phone: "" });
        setShowModal(false);
    };

    const columns = ["Name", "Surname", "Class", "Phone"];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Students</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                    <FaPlus /> Add Student
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
                {loading ? (
                    <p className="text-gray-500 text-center py-20">Loading students...</p>
                ) : students.length === 0 ? (
                    <p className="text-gray-500 text-center py-20">No students yet.</p>
                ) : (
                    <Table columns={columns} data={students} />
                )}
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
                <form className="flex flex-col gap-4" onSubmit={handleAddStudent}>
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
                        placeholder="Surname"
                        className="border rounded-xl px-4 py-2"
                        value={form.surname}
                        onChange={(e) => setForm({ ...form, surname: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Class"
                        className="border rounded-xl px-4 py-2"
                        value={form.class}
                        onChange={(e) => setForm({ ...form, class: e.target.value })}
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
                    <button type="submit" className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
                        Add Student
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Students;
