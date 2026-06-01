import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Pagination } from "../components/pagination";
import { Popup } from "../components/popup";
import { checkCurrentAuthAndId } from "../helpers/permissions";

export function meta({ }) {
  return [
    { title: "Administrator Roles and Permissions" },
    { name: "", content: "" },
  ];
}

const roleNames = new Map([
  ["member", "Member"],
  ["admin-super", "Superadmin"],
  ["admin-region-jheasa", "Regional Admin (JHEASA)"],
  ["admin-region-ajcu-na", "Regional Admin (AJCU-NA)"],
  ["admin-region-ausjal", "Regional Admin (AUSJAL)"],
  ["admin-region-kircher", "Regional Admin (KIRCHER)"],
  ["admin-region-ajcu-ap", "Regional Admin (AJCU-AP)"],
  ["admin-region-ajcu-am", "Regional Admin (AJCU-AM)"],
  ["admin-tf-rac", "TF Admin (Research & Academic Cooperation)"],
  ["admin-tf-wis", "TF Admin (Women in STEM)"],
  ["admin-tf-hea", "TF Admin (Health)"],
  ["admin-tf-aih", "TF Admin (Artificial Intelligence & Humanity)"],
  ["admin-tf-esj", "TF Admin (Engineering & Social Justice)"],
  ["admin-tf-htfi", "TF Admin (Humanitarian Tech & Frugal Innovation)"],
  ["admin-tf-infr", "TF Admin (Infrastructure)"],
  ["admin-tf-ene", "TF Admin (Energy)"],
  ["admin-newsletter", "Newsletter Admin"],
  ["admin-resources", "Resources Admin"]
]);

const regionRoles = ["admin-region-jheasa", "admin-region-ajcu-na", "admin-region-ausjal", "admin-region-kircher", "admin-region-ajcu-ap", "admin-region-ajcu-am"]
const tfRoles = ["admin-tf-rac", "admin-tf-wis", "admin-tf-hea", "admin-tf-aih", "admin-tf-esj", "admin-tf-htfi", "admin-tf-infr", "admin-tf-ene"]

async function getPeople() {
  const { data, error } = await supabase
    .from('users')
    .select('id, fname, lname, email, roles')
    .eq('verified', true);
  if (data) {
    data.sort((a, b) => { return `${a.fname} ${a.lname}` > `${b.fname} ${b.lname}` ? 1 : -1 });
  }
  return data || error;
}

async function updateMemberRoles(userId, newRoles) {
  const { error } = await supabase
    .from('users')
    .update({
      roles: newRoles
    })
    .eq('id', userId)
  return error;
}

export async function loader({ params }) {
    return getPeople();
}

function RoleCheckbox({roleName, isSuper, checkedRoles, updateChecked}) {
    return (
        <label className="checkbox">
            <input
                type="checkbox"
                checked={isSuper || checkedRoles[roleName]}
                onChange={() => updateChecked(roleName)}
                disabled={isSuper}
            />
            <p className="text-gray-dark/80">{roleNames.get(roleName)}</p>
        </label>
    )
}

function RolesEdit({ show, setShow, member, reload, currentUserId, loseMemberFocus }) {
    const navigate = useNavigate();
    if (!member) {
        member = {};
    }
    member.id = member?.id || "";
    member.fname = member?.fname || "";
    member.lname = member?.lname || "";
    member.roles = member?.roles || ["member"];

    const [showRemove, setShowRemove] = useState(false);
    const [warningMessage, setWarningMessage] = useState(" ");

    const [isSuper, setIsSuper] = useState(member?.roles.includes("admin-super") || false);
    const [checkedRoles, setCheckedRoles] = useState({
        "admin-resources": member?.roles.includes("admin-resources") || false,
        "admin-newsletter": member?.roles.includes("admin-newsletter") || false,
        "admin-region-jheasa": member?.roles.includes("admin-region-jheasa") || false,
        "admin-region-ajcu-na": member?.roles.includes("admin-region-ajcu-na") || false,
        "admin-region-ausjal": member?.roles.includes("admin-region-ausjal") || false,
        "admin-region-kircher": member?.roles.includes("admin-region-kircher") || false,
        "admin-region-ajcu-ap": member?.roles.includes("admin-region-ajcu-ap") || false,
        "admin-region-ajcu-am": member?.roles.includes("admin-region-ajcu-am") || false,
        "admin-tf-rac": member?.roles.includes("admin-tf-rac") || false,
        "admin-tf-wis": member?.roles.includes("admin-tf-wis") || false,
        "admin-tf-hea": member?.roles.includes("admin-tf-hea") || false,
        "admin-tf-aih": member?.roles.includes("admin-tf-aih") || false,
        "admin-tf-esj": member?.roles.includes("admin-tf-esj") || false,
        "admin-tf-htfi": member?.roles.includes("admin-tf-htfi") || false,
        "admin-tf-infr": member?.roles.includes("admin-tf-infr") || false,
        "admin-tf-ene": member?.roles.includes("admin-tf-ene") || false
    })

    

    useEffect(() => {
        setIsSuper(member?.roles.includes("admin-super") || false);
        setCheckedRoles({
            "admin-resources": member?.roles.includes("admin-resources") || false,
            "admin-newsletter": member?.roles.includes("admin-newsletter") || false,
            "admin-region-jheasa": member?.roles.includes("admin-region-jheasa") || false,
            "admin-region-ajcu-na": member?.roles.includes("admin-region-ajcu-na") || false,
            "admin-region-ausjal": member?.roles.includes("admin-region-ausjal") || false,
            "admin-region-kircher": member?.roles.includes("admin-region-kircher") || false,
            "admin-region-ajcu-ap": member?.roles.includes("admin-region-ajcu-ap") || false,
            "admin-region-ajcu-am": member?.roles.includes("admin-region-ajcu-am") || false,
            "admin-tf-rac": member?.roles.includes("admin-tf-rac") || false,
            "admin-tf-wis": member?.roles.includes("admin-tf-wis") || false,
            "admin-tf-hea": member?.roles.includes("admin-tf-hea") || false,
            "admin-tf-aih": member?.roles.includes("admin-tf-aih") || false,
            "admin-tf-esj": member?.roles.includes("admin-tf-esj") || false,
            "admin-tf-htfi": member?.roles.includes("admin-tf-htfi") || false,
            "admin-tf-infr": member?.roles.includes("admin-tf-infr") || false,
            "admin-tf-ene": member?.roles.includes("admin-tf-ene") || false
        });
    }, [show])

    // console.log(checkedRoles);

    function updateChecked(role) {
        setCheckedRoles({
            ...checkedRoles,
            [role]: !checkedRoles[role]
        })
    }

    function clearChecked() {
        setIsSuper(false);
        setCheckedRoles({
            "admin-resources": false,
            "admin-newsletter": false,
            "admin-region-jheasa": false,
            "admin-region-ajcu-na": false,
            "admin-region-ausjal": false,
            "admin-region-kircher": false,
            "admin-region-ajcu-ap": false,
            "admin-region-ajcu-am": false,
            "admin-tf-rac": false,
            "admin-tf-wis": false,
            "admin-tf-hea": false,
            "admin-tf-aih": false,
            "admin-tf-esj": false,
            "admin-tf-htfi": false,
            "admin-tf-infr": false,
            "admin-tf-ene": false
        });
    }

    async function updateRoles() {
        const memberNewRoles = ["member"];

        if (isSuper) {
            memberNewRoles.push("admin-super");
        } else {
            for (let role in checkedRoles) {
                if (checkedRoles[role]) {
                    memberNewRoles.push(role);
                }
            }
        }

        if (memberNewRoles.length == 1) {
            setShowRemove(true);
            return;
        }

        // console.log(memberNewRoles);

        const update = await updateMemberRoles(member.id, memberNewRoles);
        if (update === null) {
            setShow(false);
            // If user edits themselves to no longer be a superadmin
            if ((member.id == currentUserId) && !isSuper) {
                navigate("/");
            } else {
                reload(member);
            }
        }
        return;
    }

    async function removeAdmin() {
        console.log(member.id);
        const update = await updateMemberRoles(member.id, ["member"]);
        if (update === null) {
            setShow(false);
            setShowRemove(false);
            if (member.id == currentUserId) {
                navigate("/");
            } else {
                reload();
            }
        }
        return;
    }

    const editButtons = [
        {
            text: "Save Roles",
            onclick: updateRoles
        },
        {
            text: "Remove Admin",
            onclick: () => {setShowRemove(true)},
            className: "button-red"
        }
    ]

    const removeButton = [
        {
            text: "Remove Admin",
            onclick: removeAdmin,
            className: "button-red"
        }
    ]

    function handleClosePopup() {
        if (member?.roles.length < 2) {
            loseMemberFocus();
        }
        setShow(false);
    }

    function handleToggleSuper() {
        const newSuper = !isSuper;
        setIsSuper(!isSuper);
        if (member.id == currentUserId) {
            if (!newSuper) {
                setWarningMessage("This will remove your permissions to edit roles and validate users.")
            } else {
                setWarningMessage(" ");
            }
        }
    }

    return (
        <>
            <Popup id="edit-roles" show={show} setShow={setShow} buttons={editButtons} closePopup={handleClosePopup} >
                { member && 
                <>
                    <h4>{member?.fname || null} {member?.lname || null}'s roles</h4>

                    <button className="button button-light float-right" onClick={clearChecked}>Clear All</button>

                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={isSuper}
                                onChange={handleToggleSuper}
                            />
                            <p className="text-gray-dark/80">{roleNames.get("admin-super")}</p>
                        </label>

                    <div className="mt-2">
                        <RoleCheckbox roleName="admin-resources" isSuper={isSuper} checkedRoles={checkedRoles} updateChecked={updateChecked} />

                        <RoleCheckbox roleName="admin-newsletter" isSuper={isSuper} checkedRoles={checkedRoles} updateChecked={updateChecked} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <div className="mt-3 mb-2 font-semibold text-secondary-dark">Region Roles</div>
                            <div className="flex flex-col gap-2">
                                {regionRoles.map((role) => (
                                <RoleCheckbox key={role} roleName={role} isSuper={isSuper} checkedRoles={checkedRoles} updateChecked={updateChecked} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="mt-3 mb-2 font-semibold text-secondary-dark">Task Force Roles</div>
                            <div className="flex flex-col gap-2">
                                {tfRoles.map((role) => (
                                    <RoleCheckbox key={role} roleName={role} isSuper={isSuper} checkedRoles={checkedRoles} updateChecked={updateChecked} />

                                ))}
                            </div>
                        </div>

                    </div>
                    <p className="text-center text-error mt-2">
                        {warningMessage}
                    </p>
                </>
                }
            </Popup>

            <Popup id="remove-confirm" show={showRemove} setShow={setShowRemove} buttons={removeButton} nested>
                { member && 
                <>
                    <div className="w-full text-center mt-5">Remove {member?.fname} {member?.lname}'s admin permissions?</div>
                </>
                }
            </Popup>
        </>
    )
}

export default function AdminOptions({ loaderData }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null)
    const [focusMember, setFocusMember] = useState({});
    const [filters, setFilters] = useState([]);

    const [showEditPopup, setShowEditPopup] = useState(false);

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        return checkCurrentAuthAndId(setIsAdmin, setCurrentUserId, [])
    }, []);

    const [adminMemberList, setAdminMemberList] = useState(loaderData.filter((member) => {
        return member.roles.length > 1;
    }));

    async function reload(focusMember = {}) {
        const userList = await getPeople();

        setAdminMemberList(userList.filter((member) => {
            return member.roles.length > 1;
        }))

        if (focusMember) {
            setFocusMember(userList.filter((member) => {
                return member.id == focusMember.id;
            })[0]);
        } else {
            setFocusMember(focusMember);
        }

    }

    const filterSet = new Set(filters);
    const adminMemberFilteredList = filterSet.size > 0 ? adminMemberList.filter((member) => {
        const roleSet = new Set(member.roles);
        return filterSet.intersection(roleSet).size > 0;
    }) : adminMemberList;

    const toggleSelection = (value) => {
        setFilters((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    };

    const handleQueryChange = (event) => {
        const value = event.currentTarget.value;
        if (value !== query) {
        setQuery(value);
        }
    };

    // Reset to page 1 whenever query or filters change
    useEffect(() => {
        setPage(0);
    }, [query]);

    const searchMembers = useMemo(() => {
        const q = query.trim().toLowerCase();
        return loaderData.filter((member) => {
    
          const matchesQuery =
            !q ||
            member?.fname?.toLowerCase().includes(q) ||
            member?.lname?.toLowerCase().includes(q);
    
          return matchesQuery;
        });
    }, [query]);

    const PAGE_SIZE = 10;

    const totalPages = Math.ceil(searchMembers.length / PAGE_SIZE);
    const startIdx = page * PAGE_SIZE;
    const pageMembers = searchMembers.slice(startIdx, startIdx + PAGE_SIZE);
    
    // If results shrink and current page becomes invalid
    useEffect(() => {
        const lastPageIndex = Math.max(0, totalPages - 1);
        if (page > lastPageIndex) setPage(0);
    }, [page, totalPages]);


    function loseMemberFocus() {
        setFocusMember({});
    }

    return (<>
            <RolesEdit show={showEditPopup} setShow={setShowEditPopup} member={focusMember} reload={reload} currentUserId={currentUserId} loseMemberFocus={loseMemberFocus} />
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
                
            { isAdmin ? 
                <div>
                    <a href="/admin-options" className="banner-breadcrumb on-white">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>ADMIN OPTIONS</strong>
                    </a>
                    <h2>Manage Roles and Permissions</h2>
                    <div className="mt-5 md:h-[65dvh] md:flex grid grid-rows-[200px_auto] grid-cols-[200px_auto] border-2 border-gray-light rounded-md">
                
                        <div id="filter-container" className="md:w-130 md:border-r-2 md:border-b-0 border-b-2 border-gray-light grid grid-rows-[2.75rem_auto] col-span-2">
                            <div className="p-2 text-xl font-semibold text-secondary-dark border-b-2 border-gray-light">Filter</div>
                            <div className="p-2 overflow-y-auto">
                                <div className="flex flex-col gap-2">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.includes("admin-super")}
                                            onChange={() => toggleSelection("admin-super")}
                                        />
                                        <p className="text-gray-dark/80">{roleNames.get("admin-super")}</p>
                                    </label>

                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.includes("admin-resources")}
                                            onChange={() => toggleSelection("admin-resources")}
                                        />
                                        <p className="text-gray-dark/80">{roleNames.get("admin-resources")}</p>
                                    </label>

                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.includes("admin-newsletter")}
                                            onChange={() => toggleSelection("admin-newsletter")}
                                        />
                                        <p className="text-gray-dark/80">{roleNames.get("admin-newsletter")}</p>
                                    </label>
                                </div>

                                <div className="mt-3 mb-2 font-semibold text-secondary-dark">Task Force Roles</div>
                                <div className="flex flex-col gap-2">
                                    {tfRoles.map((role) => (
                                        <label key={role} className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={filters.includes(role)}
                                                onChange={() => toggleSelection(role)}
                                            />
                                            <p className="text-gray-dark/80">{roleNames.get(role)}</p>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-3 mb-2 font-semibold text-secondary-dark">Region Roles</div>
                                <div className="flex flex-col gap-2">
                                    {regionRoles.map((role) => (
                                        <label key={role} className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={filters.includes(role)}
                                                onChange={() => toggleSelection(role)}
                                            />
                                            <p className="text-gray-dark/80">{roleNames.get(role)}</p>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative md:w-100 w-full border-r-2 border-gray-light grid grid-rows-[2.75rem_auto]">
                            <div className="p-2 text-xl font-semibold text-secondary-dark border-b-2 border-gray-light">
                                <span>Admins</span>
                            </div>

                            <div className="relative overflow-y-auto">
                                { adminMemberFilteredList.map((member, idx) =>
                                    <button key={"admin-option-" + idx} 
                                            className={"block w-full text-left border-b-2 border-gray-light py-1 px-2 hover:text-primary-dark hover:cursor-pointer duration-200 " + (member.id == focusMember?.id && "text-primary-dark")}
                                            onClick={() => setFocusMember(member)}
                                        >
                                        {member?.fname} {member?.lname}
                                    </button>
                                )}
                                { adminMemberFilteredList.length == 0 && <div className="p-2 text-sm text-disabled-light italic">No admins found.</div>}
                            </div>
                        </div>

                        <div className="w-full h-100 py-2 pl-3 pr-2">
                            { focusMember && focusMember.id ? 
                                <div>
                                    <button
                                        type="button"
                                        className={"button button-light flex float-right ml-2"}
                                        onClick={() => {setShowEditPopup(true)}}
                                        >
                                        <p className="text-base mr-3 md:block hidden">Edit Roles</p>
                                        <i className={`bi bi-pencil`} />
                                    </button>
                                    <a href={`/profile/${focusMember.id}`} className="text-xl font-semibold text-secondary-dark hover:text-primary-dark hover:cursor-pointer duration-200">{focusMember?.fname} {focusMember?.lname}</a>
                                    <div className="text-sm text-gray-dark/70">{focusMember.email}</div>
                                    <div className="my-2">
                                        {focusMember.roles.map((role, idx) => {
                                            if (role != "member") {
                                                return <div key={"role-" + idx} className="text-sm float-left me-2 mb-2 px-2 py-1 text-secondary-light border-2 border-primary-light border-2 rounded-md">{roleNames.get(role)}</div>
                                            }
                                        })}
                                    </div>
                                </div>
                            :
                                <div className="w-full text-center p-2 py-10 text-sm text-disabled-light italic">No admin selected.</div>
                            }
                        </div>
                    </div>
                        <div className="p-2 text-sm text-disabled-light italic">If an admin is not found, they may be unverified. Please contact the database manager for support.</div>

                    <div className="mt-10">
                        <h4>Manage Member Roles</h4>
                        <div className="flex w-full max-w-[450px] items-center gap-2 rounded-md border-2 border-primary-light bg-white px-4 py-2 focus-within:bg-teal-50">
                            <i className="bi bi-search text-gray-dark/60" aria-hidden="true" />
                            <input
                            id="search-input"
                            value={query}
                            onChange={handleQueryChange}
                            onInput={handleQueryChange}
                            placeholder="Search IAJES Members"
                            className="w-full bg-transparent text-sm text-gray-dark outline-none"
                            />
                            <button className="size-5 duration-200 relative hover:cursor-pointer hover:text-primary-dark text-gray-dark/60"
                                    onClick={() => {document.getElementById("search-input").value = ""; setQuery("");}}>
                            <i className="bi bi-x text-[1.5rem] absolute -top-2 -left-1" />
                            </button>
                        </div>
                        <div className="my-2">
                            { searchMembers.length === 0 ? (
                                <div className="rounded-md border-2 border-gray-light bg-white px-6 py-8 text-sm text-gray-dark/70">
                                    No members found.
                                </div>
                                ) : (
                                    <>
                                    <div className="grid md:grid-cols-2 gap-2 gap-x-10">
                                        {pageMembers.map((member) => (
                                            <div key={member?.fname} className="flex p-2 items-center hover:bg-teal-50 duration-200 px-5 rounded-sm">
                                                <button className="button-icon mr-5 flex justify-between grow-2 h-[100%] items-center" onClick={() => {setFocusMember(member); setShowEditPopup(true)}}>
                                                <p className="pr-5 mr-auto" style={{ color: "black" }}>{member?.fname} {member?.lname}</p>
                                                <i className="bi bi-pencil"></i>
                                                </button>
                                                <a className="button-icon" href={`/profile/${member.id}`}><i className="bi bi-box-arrow-up-right"></i></a>
                                            </div>
                                        ))}
                                    </div>

                    
                                    {totalPages > 1 ? (
                                    <Pagination
                                        currentPage={page}
                                        setCurrentPage={setPage}
                                        totalItems={searchMembers.length}
                                        itemsPerPage={PAGE_SIZE}
                                    />
                                    ) : null}
                                </>
                                )}
                        </div>
                        <div className="w-full p-2 text-sm text-disabled-light italic">Only verified members can be admins.</div>
                    </div>
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