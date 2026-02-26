"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { useState } from "react";

const Navbar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    const res = await logout();
  };
  return (
    <nav className=" w-full py-4 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Event Planner</h1>
        </div>
        <div>
          <ul className="flex items-center gap-x-4">
            <li>
              <Button variant="destructive" onClick={() => setIsOpen(true)}>
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Logout">
        <div>
          <p>Are you sure you want to logout?</p>
          <div className="flex items-center justify-end gap-x-4 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Dialog>
    </nav>
  );
};

export default Navbar;
