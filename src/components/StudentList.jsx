import { useEffect, useState } from "react";
import api from "../services/api";


export default function StudentList({ group }) {
const [students, setStudents] = useState([]);


useEffect(() => {
const fetchStudents = async () => {
try {
const res = await api.get(`/groups/${group._id}/students`);
setStudents(res.data);
} catch (err) {
console.log(err);
}
};
fetchStudents();
}, [group]);


return (
<div className="bg-white p-4 rounded shadow">
<h3 className="text-2xl font-semibold mb-2">{group.name} o‘quvchilari</h3>
<ul>
{students.map((s) => (
<li key={s._id} className="border-b py-2">
{s.fullName} ({s.gender}) - {s.class}
</li>
))}
</ul>
</div>
);
}