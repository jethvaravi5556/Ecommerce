import React, { useState } from 'react';
import ROLE from '../common/role';
import SummaryApi from '../common';
import { toast } from 'react-toastify'; //  Import toast for notifications
import { useDispatch } from 'react-redux'; //  Import Redux dispatch
import { useNavigate } from 'react-router-dom'; //  Import navigate for redirection

const ChangeUserRole = ({ user, onClose,callFunc }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const updateUserRole = async () => {
    try {
      let apiUrl = SummaryApi.updateUser.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, ""); // Remove hidden ZWSP characters

      const response = await fetch(apiUrl, {
        method: SummaryApi.updateUser.method, //  Fixed key name (updateuser → updateUser)
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //  To include cookies (JWT token)
        body: JSON.stringify({ userId: user._id, role: selectedRole }), //  Send correct data format
      });

      const data = await response.json();
      console.log(data.message);

      if (data.success) {
        toast.success(data.message);
        //dispatch(setUserDetails(null)); //  Clear user from Redux
        onClose()
        callFunc()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Updating role failed:", error);
      toast.error("Failed to update role. Try again.");
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-black bg-opacity-50'>
      <div className='mx-auto bg-white p-6 shadow-md w-full max-w-sm rounded-lg'>
        <h1 className='pb-4 text-lg font-medium text-center'>Change User Role</h1>
        
        <p className="text-gray-600 mb-2"><strong>Name:</strong> {user?.name}</p>
        <p className="text-gray-600 mb-2"><strong>Name:</strong> {user?.email}</p>

        <label className="block text-sm font-medium text-gray-700">Select Role:</label>
        <select 
          className='w-full p-2 mt-2 border border-gray-300 rounded-md' 
          value={selectedRole} 
          onChange={handleOnChange}
        >
          {Object.values(ROLE).map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>

        <div className="flex justify-between mt-6">
          <button 
            type="button" 
            className='px-4 py-2 bg-gray-500 text-white rounded-md' 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button"  //  Changed from submit to button
            className='px-4 py-2 bg-red-600 text-white rounded-md'
            onClick={updateUserRole}
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserRole;
