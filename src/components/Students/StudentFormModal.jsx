import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";

export default function StudentFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEditing = false
}) {
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        phone: "",
        parentPhone: "",
        className: "",
        direction: "",
        address: "",
        residence: "Uyda",
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const URL = import.meta.env.VITE_API_URL
    const studentImgURL = URL.slice(0, URL.length - 4);

    // Residence options
    const residenceOptions = [
        { value: "Maktab Yotoqxonasi", label: "Maktab Yotoqxonasi" },
        { value: "Uyda", label: "Uyda" }
    ];

    // Direction options
    const directionOptions = [
        "Matematika", "Fizika", "Kimyo", "Biologiya",
        "Ingliz tili", "Rus tili", "Informatika", "Tarix",
        "Geografiya", "Adabiyot"
    ];

    // Initialize form
    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : "",
                phone: initialData.phone || "",
                parentPhone: initialData.parentPhone || "",
                className: initialData.className || "",
                direction: initialData.direction || "",
                address: initialData.address || "",
                residence: initialData.residence || "Uyda",
                image: null
            });

            if (initialData.image) {
                setImagePreview(`${studentImgURL + initialData.image}`);
            } else {
                setImagePreview(null);
            }
        } else {
            resetForm();
        }
    }, [initialData]);

    const resetForm = () => {
        setFormData({
            fullName: "",
            birthDate: "",
            phone: "",
            parentPhone: "",
            className: "",
            direction: "",
            address: "",
            residence: "Uyda",
            image: null
        });
        setImagePreview(null);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert("Rasm hajmi 5MB dan oshmasligi kerak!");
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    alert("Faqat rasm fayllarni yuklashingiz mumkin!");
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                setFormData(prev => ({ ...prev, image: file }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    if (key === 'birthDate' && formData[key]) {
                        formDataToSend.append(key, new Date(formData[key]).toISOString().split('T')[0]);
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            await onSubmit(formDataToSend);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="backdrop-blur-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center flex-1">
                            {isEditing ? "O'quvchini tahrirlash" : "Yangi o'quvchi"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Image & Residence */}
                        <div className="lg:col-span-1">
                            {/* Image Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold dark:text-white mb-3">O'quvchi rasmi:</label>
                                <div className="flex flex-col items-center">
                                    <div className="relative w-40 h-40 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden mb-4">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                <span className="text-6xl text-gray-400">👨‍🎓</span>
                                            </div>
                                        )}
                                    </div>

                                    <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
                                        📸 Rasm yuklash
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                        JPG, PNG, maksimal 5MB
                                    </p>
                                </div>
                            </div>

                            {/* Residence */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold dark:text-white mb-2">Yashash joyi:</label>
                                <select
                                    name="residence"
                                    value={formData.residence}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                >
                                    {residenceOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ism familiya"
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                </div>

                                {/* Birth Date */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">Tug'ilgan sana:</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">Telefon:</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+99890 123-45-67"
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                </div>

                                {/* Class */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">Sinf:</label>
                                    <input
                                        type="text"
                                        name="className"
                                        value={formData.className}
                                        onChange={handleChange}
                                        required
                                        placeholder="9-A"
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                </div>

                                {/* Direction */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">Yo'nalish:</label>
                                    <select
                                        name="direction"
                                        value={formData.direction}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    >
                                        <option value="">Tanlang</option>
                                        {directionOptions.map((dir) => (
                                            <option key={dir} value={dir}>{dir}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Parent Phone */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">Ota-ona telefoni:</label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={formData.parentPhone}
                                        onChange={handleChange}
                                        placeholder="+99890 987-65-43"
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                </div>

                                {/* Address - Full width */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold dark:text-white mb-2">Yashash manzili:</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Toshkent shahar, Yashnobod tumani..."
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-[#444] transition"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 rounded-xl shadow-2xl shadow-red-500 bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saqlanmoqda...
                                        </>
                                    ) : (
                                        <>
                                            {isEditing ? "Yangilash" : "Qo'shish"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}