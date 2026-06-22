import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { checkCurrentAuth } from "../helpers/permissions";
import "../styles/profile.css";

export function meta({ }) {
  return [
    { title: "Administrator Options" },
    { name: "", content: "" },
  ];
}

async function getUniversities() {
  const { data, error } = await supabase
    .from('universities')
    .select('university');
  if (data) {
    data.sort((a, b) => { return a.university > b.university ? 1 : -1 });
  }
  return data || error;
}

const allowedRoles = ["admin-university", "admin-region-jheasa", "admin-region-ajcu-na", "admin-region-ausjal", "admin-region-kircher", "admin-region-ajcu-ap", "admin-region-ajcu-am"]

export async function loader({ params }) {
    const universityList = await getUniversities()
    return { universityList: universityList };
}

export default function AdminContact({ loaderData }) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        return checkCurrentAuth(setIsAdmin, allowedRoles)
    }, []);

    return (<>
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
            { isAdmin ? 
                <div>
                    <a href="/admin-options" className="banner-breadcrumb on-white">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>ADMIN OPTIONS</strong>
                    </a>
                    <h2>Mass Contact</h2>
                    <p>
                        Get all the emails from registered IAJES members from a university or a region.
                    </p>
                    <div className="mt-4">
                        <label htmlFor="university" className="text-secondary-dark"><strong>University</strong></label>
                        <br />
                        <select id="university" name="university" className="input input-text" >
                            <option value="" disabled selected>Select a university</option>
                            { (loaderData.universityList) ? loaderData.universityList.map((universityObj, idx) => <option key={"uni-" + idx} value={universityObj.university} >{universityObj.university}</option>) : <></>}
                        </select>
                        <button className="button ms-4">Get emails</button>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="region" className="text-secondary-dark"><strong>Region</strong></label>
                        <br />
                        <select id="region" name="region" className="input input-text" >
                            <option value="" disabled selected>Select a region</option>
                            <option value="JHEASA">JHEASA</option>
                            <option value="AJCU-NA">AJCU - NA</option>
                            <option value="AUSJAL">AUSJAL</option>
                            <option value="KIRCHER">KIRCHER</option>
                            <option value="AJCU-AP">AJCU - AP</option>
                            <option value="AJCU-AM">AJCU - AM</option>
                        </select>
                        <button className="button ms-4">Get emails</button>
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