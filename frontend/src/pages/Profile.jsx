import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const validateName = (name) => {
    return /^[A-Za-z\s]{3,}$/.test(name.trim());
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(email);
  };

  const fetchProfile = async () => {
    const response = await fetch(SummaryApi.userProfile.url, {
      method: SummaryApi.userProfile.method,
      credentials: "include",
    });

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

    if (name === "name") {
      const onlyText = value.replace(/[^A-Za-z\s]/g, "");
      setUser((prev) => ({
        ...prev,
        name: onlyText,
      }));
      return;
    }

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(user.name)) {
      toast.error("Name must contain only alphabets and minimum 3 characters");
      return;
    }

    if (!validateEmail(user.email)) {
      toast.error("Invalid email format");
      return;
    }

    const response = await fetch(SummaryApi.updateProfile.url, {
      method: SummaryApi.updateProfile.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name.trim().replace(/\s+/g, " "),
        email: user.email,
      }),
    });

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
            required
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
            required
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
