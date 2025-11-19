import { useState } from "react";
import StudentList from "./StudentList";


export default function GroupList({ groups }) {
const [selectedGroup, setSelectedGroup] = useState(null);


return (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{groups.map((group) => (
<div
key={group._id}
className="bg-white p-4 rounded shadow cursor-pointer"
onClick={() => setSelectedGroup(group)}
>
<h2 className="text-xl font-semibold">{group.name}</h2>
<p>O‘qituvchi: {group.teacherId?.fullName || '---'}</p>
</div>
))}


{selectedGroup && (
<div className="col-span-1 md:col-span-2 mt-4">
<StudentList group={selectedGroup} />
</div>
)}
</div>
);
}