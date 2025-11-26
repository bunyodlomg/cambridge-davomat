import React from "react";
import { useState, useEffect } from "react";
import Table from "../components/Table";
import axios from "axios";
import { FaPlus, FaUserPlus } from "react-icons/fa";

// Dummy modal component
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

const Group = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [form, setForm] = useState({
        name: "",
        subject: "",
        teacherId: "",
        time: "",
        studentId: "",
    });

    const columns = ["Name", "Subject", "Teacher", "Time", "Students", "Actions"];

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axios.get("/api/groups");
                setGroups(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/groups/create", form);
            show({ type: "success", message: "Guruh yaratildi!" });
            setShowCreateModal(false);
        } catch (err) {
            console.error(err);
            show({ type: "error", message: err });

        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/groups/add-student", {
                groupId: selectedGroup._id,
                studentId: form.studentId,
            });
            show({ type: "success", message: "O'quvchi qo'shildi"});
            setShowAddStudentModal(false);
        } catch (err) {
            console.error(err);
            show({ type: "error", message: err});
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Groups</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                    <FaPlus /> Create Group
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
                {loading ? (
                    <p className="text-gray-500 text-center py-20">Loading groups...</p>
                ) : groups.length === 0 ? (
                    <p className="text-gray-500 text-center py-20">No groups yet.</p>
                ) : (
                    <Table
                        columns={columns}
                        data={groups.map((g) => ({
                            Name: g.name,
                            Subject: g.subject,
                            Teacher: g.teacher?.fullName || "-",
                            Time: g.time,
                            Students: g.students.length,
                            Actions: (
                                <button
                                    onClick={() => {
                                        setSelectedGroup(g);
                                        setShowAddStudentModal(true);
                                    }}
                                    className="flex items-center gap-1 bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 transition"
                                >
                                    <FaUserPlus /> Add Student
                                </button>
                            ),
                        }))}
                    />
                )}
            </div>

            {/* Create Group Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
                <form className="flex flex-col gap-4" onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        placeholder="Group Name"
                        className="border rounded-xl px-4 py-2"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        className="border rounded-xl px-4 py-2"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Teacher ID"
                        className="border rounded-xl px-4 py-2"
                        value={form.teacherId}
                        onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                        required
                    />
                    <input
                        type="time"
                        placeholder="Time"
                        className="border rounded-xl px-4 py-2"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                    >
                        Create
                    </button>
                </form>
            </Modal>

            {/* Add Student Modal */}
            <Modal show={showAddStudentModal} onClose={() => setShowAddStudentModal(false)}>
                <h2 className="text-xl font-semibold mb-4">Add Student to {selectedGroup?.name}</h2>
                <form className="flex flex-col gap-4" onSubmit={handleAddStudent}>
                    <input
                        type="text"
                        placeholder="Student ID"
                        className="border rounded-xl px-4 py-2"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                    >
                        Add Student
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Group;
