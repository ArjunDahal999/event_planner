"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { useState } from "react";
import { tokenStore } from "@/utils/token-store";
import Link from "next/link";

const Navbar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const accessToken = tokenStore().getAccessToken();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <nav className=" w-full py-4 px-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/">
            <h1 className="text-2xl font-bold">Event Planner</h1>
          </Link>
        </div>
        <div>
          <ul className="flex items-center gap-x-4">
            {accessToken ? (
              <li>
                <Button variant="destructive" onClick={() => setIsOpen(true)}>
                  Logout
                </Button>
              </li>
            ) : (
              <li>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </li>
            )}
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
