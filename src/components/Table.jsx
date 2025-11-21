import React from "react";

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 text-gray-500 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b last:border-none hover:bg-gray-50 transition-colors duration-200">
              {columns.map((col) => (
                <td key={col} className="px-6 py-4">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
