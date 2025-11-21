const Topbar = ({ user }) => {
    return (
        <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-b-2xl">
            <h2 className="text-xl font-semibold text-gray-700">Welcome, {user?.fullName || "User"}</h2>
            <div className="text-gray-500">{user?.role || ""}</div>
        </div>
    );
};

export default Topbar;
