import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { checkCurrentAuth } from "../helpers/permissions";

export function meta({ }) {
  return [
    { title: "Administrator User Verification" },
    { name: "", content: "" },
  ];
}

async function getUnverifiedUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, fname, lname, email, verified');
  if (data) {
    const unverifiedMembers = data.filter((user) => {
        return !user.verified;
    })
    unverifiedMembers.sort((a, b) => { return `${a.fname} ${a.lname}` > `${b.fname} ${b.lname}` ? 1 : -1 });
    return unverifiedMembers;
  }
  return error;
}

export async function loader({ params }) {
    return getUnverifiedUsers();
}

export default function AdminVerification({ loaderData }) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        return checkCurrentAuth(setIsAdmin, [])
    }, []);

    const unverifiedUsers = loaderData;
    // console.log(unverifiedUsers);

    return (<>
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
            { isAdmin ? 
                <div>
                    <h2>Manage User Verification</h2>
                    <div className="flex">
                        <div className="border-2 border-gray-light rounded-md w-full">
                            <div className="p-2 text-xl font-semibold text-secondary-dark border-b-2 border-gray-light">Unverified Users</div>

                            <div className="h-[65vh] overflow-y-auto">
                                { unverifiedUsers.map((user, idx) => (
                                    <div key={idx} className="p-1 px-2 border-b-2 last:border-b-0 border-gray-light flex justify-between">
                                        <a href={`/profile/${user.id}`} className="hover:text-primary-light hover:cursor-pointer duration-200">
                                            {user.fname} {user.lname}
                                            <span className="ml-3 text-disabled-light italic">{user.email}</span>
                                        </a>
                                        <label className="checkbox" style={{marginRight: 0}}>
                                            <input type="checkbox" /><p></p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col align-center ml-5 shrink-0">
                            <button className="button block mb-4">Verify selected users</button>
                            <button className="button button-light block">Clear selected</button>
                        </div>
                    </div>
                    
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