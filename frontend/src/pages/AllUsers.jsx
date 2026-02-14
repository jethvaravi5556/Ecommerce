import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState(null);

  const fetchAllUsers = async () => {
    let apiUrl = SummaryApi.AllUsers.url.trim();
    apiUrl = apiUrl.replace(/\u200B/g, "");

    const fetchData = await fetch(apiUrl, {
      method: SummaryApi.AllUsers.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    } else {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // ✅ Filter logic
  const filteredUsers = allUsers.filter((user) =>
    filterRole ? user.role === filterRole : true,
  );

  return (
    <div className="bg-white pb-4 p-4">
      {/* 🔹 Filter Dropdown */}
      <div className="mb-4">
        <select
          className="border p-2 rounded"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Users</option>
          <option value="ADMIN">Admin</option>
          <option value="GENERAL">General</option>
        </select>
      </div>

      <table className="w-full userTable">
        <thead>
          <tr className="bg-black text-white">
            <th>sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id} className="text-center">
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{moment(user.createdAt).format("LL")}</td>
              <td>
                <button
                  className="bg-green-100 p-2 cursor-pointer rounded-full hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    setUpdateUserDetails(user);
                    setOpenUpdateRole(true);
                  }}
                >
                  <MdModeEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openUpdateRole && updateUserDetails && (
        <ChangeUserRole
          user={updateUserDetails}
          onClose={() => setOpenUpdateRole(false)}
          callFunc={fetchAllUsers}
        />
      )}
      {/* show if no users */}
      {!filteredUsers.length && (
        <p className="text-center mt-4">No Users Found</p>
      )}
    </div>
  );
};

export default AllUsers;


