import { useState, useEffect, useRef, useActionState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "../supabase";
import { Link } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { checkCurrentAuth } from "../helpers/permissions";
import "../styles/profile.css";

export function meta({ }) {
  return [
    { title: "Administrator Options" },
    { name: "", content: "" },
  ];
}

export default function AdminOptions({ }) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        return checkCurrentAuth(setIsAdmin, [])
    }, []);

    return (<>
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
            { isAdmin ? 
                <div>
                    <h1>Administrator Options</h1>
                    <a className="hover-card block my-5 px-10 py-5 border-2 border-gray-light rounded-md hover:shadow-md hover:cursor-pointer duration-200">
                        <h4>Roles and Permissions</h4>
                        <p className="text-s text-disabled-light">Edit users' admin roles and permissions to edit site content.</p>
                    </a>
                    <a className="hover-card block my-5 px-10 py-5 border-2 border-gray-light rounded-md hover:shadow-md hover:cursor-pointer duration-200">
                        <h4>Account Validation</h4>
                        <p className="text-s text-disabled-light">Validate user accounts.</p>
                    </a>
                </div>
            :
                <div>
                    <p>This page is not available.</p>
                </div>
            }
            </div>
            <Footer />
        </>
    )
}