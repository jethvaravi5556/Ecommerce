import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const fetchProfile = async () => {
    const response = await fetch(
      SummaryApi.userProfile.url,

      {
        method: SummaryApi.userProfile.method,
        credentials: "include",
      },
    );

    const data = await response.json();

    if (data.success) {
      setUser(data.data);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      SummaryApi.updateProfile.url,

      {
        method: SummaryApi.updateProfile.method,

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: user.name,
          email: user.email,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Profile Updated");

      fetchProfile();
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="border w-full p-2 rounded mb-3"
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="border w-full p-2 rounded mb-3"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
