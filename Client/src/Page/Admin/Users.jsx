import React from "react";

const UsersList = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">User ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((user) => (
            <tr key={user} className="border-t">
              <td className="p-2">#USR00{user}</td>
              <td className="p-2">Alice Smith</td>
              <td className="p-2">alice@example.com</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
