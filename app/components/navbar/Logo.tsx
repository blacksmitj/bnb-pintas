"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      alt="Logo"
      className="hidden md:block cursor-pointer"
      height="100"
      width="100"
      src="/Images/logo.png"
    />
    // <div>
    //   <h1 className="font-bold md:block cursor-pointer">P3DW Kawaluyaan</h1>
    // </div>
  );
};

export default Logo;
