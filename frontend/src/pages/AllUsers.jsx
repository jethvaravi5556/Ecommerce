import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState(null);

  const fetchAllUsers = async () => {
    let apiUrl = SummaryApi.AllUsers.url.trim();
    apiUrl = apiUrl.replace(/\u200B/g, ""); // Remove hidden characters

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

  return (
    <div className="bg-white pb-4">
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
          {allUsers.map((user, index) => (
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
                    setUpdateUserDetails(user); // ✅ Pass selected user details
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
    </div>
  );
};

export default AllUsers;
