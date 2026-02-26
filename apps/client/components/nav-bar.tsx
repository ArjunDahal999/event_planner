"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "./ui/button";

const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const res = await logout();
  };
  return (
    <nav className=" w-full py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Event Planner</h1>
        </div>
        <div>
          <ul className="flex items-center gap-x-4">
            <li>
              <Link className=" hover:text-primary" href="/events">
                Events
              </Link>
            </li>
            <li>
              <Link className=" hover:text-primary" href="/events/create">
                Create Event
              </Link>
            </li>
            <li>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
