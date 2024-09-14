"use client";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(true);
    }, 1);

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <header className="flex justify-center p-4">
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: 'h-12 w-12', // Larger circle
          },
        }}
      />
    </header>
  );
};

export default Header;
