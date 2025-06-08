"use client";

import React, { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import toast from "react-hot-toast";

const CustomLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin(); // React-Admin login handler
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password }); // React-Admin handles the authProvider logic
      toast.success("Login successful!");
    } catch (error) {
      notify("Invalid email or password", { type: "error" });
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-12">
      <form onSubmit={handleSubmit} className="w-96 p-6 bg-white rounded shadow">
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default CustomLogin;