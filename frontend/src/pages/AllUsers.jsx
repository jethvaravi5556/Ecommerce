import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState(null);

  const fetchAllUsers = async () => {
    const response = await fetch(
      `${SummaryApi.AllUsers.url}?page=${page}&limit=10`,
      {
        method: SummaryApi.AllUsers.method,
        credentials: "include",
      },
    );

    const dataResponse = await response.json();

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
      setTotalPage(dataResponse.totalPage);
    } else {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [page]);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    const response = await fetch(`${SummaryApi.deleteUser.url}/${id}`, {
      method: SummaryApi.deleteUser.method,
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      toast.success(data.message);
      fetchAllUsers();
    } else {
      toast.error(data.message);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    filterRole ? user.role === filterRole : true,
  );

  return (
    <div>
      {/* Header */}
      <div className="bg-white py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded">
        <h2 className="font-bold text-lg">All Users</h2>

        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Users</option>
          <option value="ADMIN">Admin</option>
          <option value="GENERAL">General</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-4 mt-4 rounded w-full overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-black text-white">
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="text-center border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{moment(user.createdAt).format("LL")}</td>

                <td className="p-2">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-green-100 p-2 rounded-full hover:bg-green-500 hover:text-white"
                      onClick={() => {
                        setUpdateUserDetails(user);
                        setOpenUpdateRole(true);
                      }}
                    >
                      <MdModeEdit />
                    </button>

                    <button
                      className="bg-red-100 p-2 rounded-full hover:bg-red-600 hover:text-white"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filteredUsers.length && (
          <p className="text-center mt-4">No Users Found</p>
        )}
      </div>

      {openUpdateRole && updateUserDetails && (
        <ChangeUserRole
          user={updateUserDetails}
          onClose={() => setOpenUpdateRole(false)}
          callFunc={fetchAllUsers}
        />
      )}

      {totalPage > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
