import { useState, useEffect } from "react";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { checkCurrentAuth } from "../helpers/permissions";
import { supabaseAdmin } from "../server/supabaseAdmin.server";
import "../styles/profile.css";
import "../styles/regional-meetings.css";

export function meta({ }) {
  return [
    { title: "Administrator Options" },
    { name: "", content: "" },
  ];
}

export async function loader() {
    const { count, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("*", { count: "exact", head: true });

    if (error) {
        console.error("Error loading newsletter subscriber count", error);
        return { subscriberCount: 0 };
    }

    return { subscriberCount: count ?? 0 };
}

export default function AdminOptions({ loaderData }) {
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
                    <a href="/admin-options/roles" className="hover-card block my-5 px-10 py-5 border-2 border-gray-light rounded-md hover:shadow-md hover:cursor-pointer duration-200">
                        <h4>Roles and Permissions</h4>
                        <p className="text-s text-disabled-light">Edit users' admin roles and permissions to edit site content.</p>
                    </a>
                    <a href="/admin-options/verification" className="hover-card block my-5 px-10 py-5 border-2 border-gray-light rounded-md hover:shadow-md hover:cursor-pointer duration-200">
                        <h4>Account Validation</h4>
                        <p className="text-s text-disabled-light">Validate user accounts.</p>
                    </a>
                    <a href="/admin-options/contact" className="hover-card block my-5 px-10 py-5 border-2 border-gray-light rounded-md hover:shadow-md hover:cursor-pointer duration-200">
                        <h4>Mass Contact</h4>
                        <p className="text-s text-disabled-light">Fetch all member emails from a region or university.</p>
                    </a>
                    <a href="/newsletter/drafts" className="hover-card flex items-start justify-between gap-4 my-5 px-10 py-5 border-2 border-gray-light rounded-md hover:shadow-md hover:cursor-pointer duration-200">
                        <div>
                            <h4>Newsletter Drafts</h4>
                            <p className="text-s text-disabled-light">Edit and publish IAJES newsletters.</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                            <span className="regional-card-statistic">{loaderData?.subscriberCount ?? 0}</span>
                            <p className="regional-card-caption">subscribers</p>
                        </div>
                    </a>
                </div>
            :
                <div>
                    {/* <p>This page is not available.</p> */}
                </div>
            }
            </div>
            <Footer />
        </>
    )
}