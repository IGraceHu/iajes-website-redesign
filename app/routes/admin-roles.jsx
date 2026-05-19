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

async function getPeople() {
  const { data, error } = await supabase
    .from('users')
    .select('id, fname, lname, email, roles')
  if (data) {
    data.sort((a, b) => { return `${a.fname} ${a.lname}` > `${b.fname} ${b.lname}` ? 1 : -1 });
  }
  return data || error;
}

export async function loader({ params }) {
    return getPeople();
}

function MemberCard({ memberInfo }) {
    if (memberInfo) {
        return (
            <div className="hover-card block my-5 px-5 py-3 border-2 border-gray-light rounded-md hover:shadow-md duration-200">
                <div className="text-xl font-semibold text-secondary-dark">{memberInfo.fname} {memberInfo.lname}</div>
                <div className="text-sm text-gray-dark/70">{memberInfo.email}</div>
                <div className="my-2">
                    {memberInfo.roles.map((role) => {
                        if (role != "member") {
                            return <div className="text-sm float-left me-2 mb-2 px-2 py-1 text-secondary-light border-2 border-primary-light border-2 rounded-md">{roleNames.get(role)}</div>
                        }
                    })}
                </div>
            </div>
        )
    }
    
}

export default function AdminOptions({ loaderData }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [focusMember, setFocusMember] = useState(null);

    useEffect(() => {
        return checkCurrentAuth(setIsAdmin, [])
    }, []);

    const memberList = loaderData;
    const adminMemberList = memberList.filter((member) => {
        return member.roles.length > 1;
    })

    return (<>
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
            { isAdmin ? 
                <div>
                    <h1>Manage Roles and Permissions</h1>
                    <div className="flex">
                        <div className="relative h-100 border-2 border-gray-light w-100 rounded-l-md">
                            <div>
                                <div className="p-2 text-xl font-semibold text-secondary-dark border-b-2 border-gray-light">Admins</div>
                            </div>
                            <div className="relative overflow-y-scroll h-auto">
                                {adminMemberList.map((member, idx) =>
                                    <button key={"admin-card-" + idx} 
                                            className={"block w-full text-left border-b-2 border-gray-light py-1 px-2 hover:text-primary-dark hover:cursor-pointer duration-200 " + (member.id == focusMember?.id && "text-primary-dark")}
                                            onClick={() => setFocusMember(member)}
                                        >
                                        {member.fname} {member.lname}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-100 border-2 border-l-0 border-gray-light rounded-r-md py-2 pl-3 pr-2">
                            { focusMember ? 
                                <div>
                                    <button
                                        type="button"
                                        className={"button button-light flex float-right"}
                                        >
                                        <p className="text-base mr-3">Edit Roles</p>
                                        <i className={`bi bi-pencil`} />
                                    </button>
                                    <a href={`/profile/${focusMember.id}`} className="text-xl font-semibold text-secondary-dark hover:text-primary-dark hover:cursor-pointer duration-200">{focusMember.fname} {focusMember.lname}</a>
                                    <div className="text-sm text-gray-dark/70">{focusMember.email}</div>
                                    <div className="my-2">
                                        {focusMember.roles.map((role) => {
                                            if (role != "member") {
                                                return <div className="text-sm float-left me-2 mb-2 px-2 py-1 text-secondary-light border-2 border-primary-light border-2 rounded-md">{roleNames.get(role)}</div>
                                            }
                                        })}
                                    </div>
                                </div>
                            :
                                <div>Wah</div>
                            }
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