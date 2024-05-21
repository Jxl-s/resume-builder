"use client";

import { FC } from "react";
import Button from "./Button";
import { FaBars } from "react-icons/fa";

const Nav: FC = () => {
    return (
        <>
            <nav className="flex justify-between p-4 bg-dark1 print:hidden w-full fixed top-0 z-10">
                <ul className="flex gap-8 items-center">
                    <li className="font-bold text-3xl">
                        <FaBars className="w-6 h-6" />
                    </li>
                    <li className="font-bold text-3xl">ResumeBuilder</li>
                    <li className="font-semibold text-primary">Resume</li>
                </ul>
                <Button className="font-semibold px-8">Sign In</Button>
            </nav>
            {/* <div
                style={{
                    marginBottom: "68px",
                }}
            /> */}
        </>
    );
};

export default Nav;
