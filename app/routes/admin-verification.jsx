import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
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

async function verifyUsers(userIdList) {
    const { data, error } = await supabase
        .from('users')
        .update({ verified: 'TRUE' })
        .in('id', userIdList)
        .select();

    if (!data || data.length === 0) {
        const rlsError = new Error("No rows updated. You may be missing an UPDATE policy in Supabase.");
        console.error(rlsError.message);
        return rlsError;
    }

    return null;
}

export async function loader({ params }) {
    return getUnverifiedUsers();
}

export default function AdminVerification({ loaderData }) {
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const unverifiedUsers = loaderData;
    
    const starter = {};
    for (let user of unverifiedUsers) {
        starter[user.id] = false;
    }

    const [checkedIds, setCheckedIds] = useState(starter);

    const [query, setQuery] = useState("");

    const popupButtons = [
        { text: "Verify Users", onclick: handleVerify }
    ]

    useEffect(() => {
        return checkCurrentAuth(setIsAdmin, [])
    }, []);


    function handleCheck(userid) {
        if (checkedIds[userid]) {
            setCheckedIds({
                ...checkedIds,
                [userid]: false
            })
        } else {
            setCheckedIds({
                ...checkedIds,
                [userid]: true
            })
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const filteredCheckedIds = Object.keys(checkedIds).filter((id) => {
            return checkedIds[id];
        });

        if (filteredCheckedIds.length > 0) {
            setShowPopup(true);
        }
    }

    function clearSelected(e) {
        e.preventDefault();
        setCheckedIds(starter);
    }

    async function handleVerify() {
        const filteredCheckedIds = Object.keys(checkedIds).filter((id) => {
            return checkedIds[id];
        });
        const verify = await verifyUsers(filteredCheckedIds);
        if (verify == null) {
            setShowPopup(false);
            navigate(0);
        }
    }

    function getUserById(id) {
        for (let user of unverifiedUsers) {
            if (id == user.id) {
                return user;
            }
        }
        return null;
    }

    const handleQueryChange = (event) => {
        const value = event.currentTarget.value;
        if (value !== query) {
        setQuery(value);
        }
    };

    const searchUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        return unverifiedUsers.filter((user) => {
    
            const matchesQuery =
            !q ||
            user?.fname?.toLowerCase().includes(q) ||
            user?.lname?.toLowerCase().includes(q);
    
            return matchesQuery || checkedIds[user.id];
        });
    }, [query]);

    return (<>
            <Popup show={showPopup} setShow={setShowPopup} buttons={popupButtons}>
                <h6>Verify the following users?</h6>
                <div className="mt-2">
                    { Object.keys(checkedIds).map((userid, idx) => {
                        if (checkedIds[userid]){
                            const user = getUserById(userid);
                            return <div key={userid}>{user.fname} {user.lname} <span className="ml-3 text-disabled-light italic">{user.email}</span></div>
                        }
                    })}
                </div>
            </Popup>
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
            { isAdmin ? 
                <div>
                    <a href="/admin-options" className="banner-breadcrumb on-white">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>ADMIN OPTIONS</strong>
                    </a>
                    <h2>Manage User Verification</h2>
                    <form className="flex md:flex-row flex-col-reverse" onSubmit={handleSubmit}>
                        <div className="border-2 border-gray-light rounded-md w-full">
                            <div className="p-2 border-b-2 border-gray-light">
                                <div className="text-xl font-semibold text-secondary-dark mb-2">Unverified Users</div>

                                <div className="flex w-full items-center gap-2 rounded-md border-2 border-primary-light bg-white px-4 py-2 focus-within:bg-teal-50">
                                    <i className="bi bi-search text-gray-dark/60" aria-hidden="true" />
                                    <input
                                    id="search-input"
                                    value={query}
                                    onChange={handleQueryChange}
                                    onInput={handleQueryChange}
                                    placeholder="Search Users"
                                    className="w-full bg-transparent text-sm text-gray-dark outline-none"
                                    />
                                    <button className="size-5 duration-200 relative hover:cursor-pointer hover:text-primary-dark text-gray-dark/60"
                                            onClick={() => {document.getElementById("search-input").value = ""; setQuery("");}}>
                                    <i className="bi bi-x text-[1.5rem] absolute -top-2 -left-1" />
                                    </button>
                                </div>
                            </div>

                            <div className="h-[50vh] overflow-y-auto">
                                { searchUsers.map((user, idx) => (
                                    <div key={idx} className={"p-1 px-2 border-b-2 last:border-b-0 border-gray-light flex justify-between " + (checkedIds[user.id] && "bg-teal-50")}>
                                        <span>
                                            <a href={`/profile/${user.id}`} className="hover:text-primary-light hover:cursor-pointer duration-200">
                                                {user.fname} {user.lname}
                                            </a>
                                            <span className="ml-3 text-disabled-light italic">{user.email}</span>
                                        </span>
                                        <label className="checkbox" style={{marginRight: 0}}
                                        >
                                            <input name={user.id} type="checkbox" checked={checkedIds[user.id]}
                                                onChange={() => {handleCheck(user.id)}}
                                            /><p></p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex md:flex-col align-center md:ml-5 mb-4 shrink-0">
                            <input type="submit" value="Verify selected users" className="button block md:mb-4 md:mr-0 mr-4" />
                            <button type="button" className="button button-light block" onClick={clearSelected}>Clear selected</button>
                        </div>
                    </form>
                    
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