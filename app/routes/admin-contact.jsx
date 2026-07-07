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

async function getEmailsByUniversity(university) {
    const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('university', university);
    
    if (data) {
        const emailList = [];
        data.map((user) => emailList.push(user.email));
        return emailList;
    }
    return error;
}

async function getEmailsByRegion(region) {
    const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('region', region);
    
    if (data) {
        const emailList = [];
        data.map((user) => emailList.push(user.email));
        return emailList;
    }
    return error;
}

const allowedRoles = ["admin-university", "admin-region-jheasa", "admin-region-ajcu-na", "admin-region-ausjal", "admin-region-kircher", "admin-region-ajcu-ap", "admin-region-ajcu-am"]

export async function loader({ params }) {
    const universityList = await getUniversities()
    return { universityList: universityList };
}

export default function AdminContact({ loaderData }) {
    const [isAdmin, setIsAdmin] = useState(false);

    const [selectedUni, setSelectedUni] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");

    const [uniMessage, setUniMessage] = useState("");
    const [regionMessage, setRegionMessage] = useState("");

    useEffect(() => {
        return checkCurrentAuth(setIsAdmin, allowedRoles)
    }, []);

    async function copyEmailsByUniversity() {
        if (selectedUni != "") {
            const emailList = await getEmailsByUniversity(selectedUni);
            if (emailList.length > 0) {
                if (copyEmailsToClipboard(emailList)) {
                    setUniMessage(emailList.length + " emails copied to clipboard");
                } else {
                    setUniMessage("Something went wrong. Please reload the page and try again.");
                }
            } else {
                setUniMessage("No emails to copy.");
            }
        }
    }

    async function copyEmailsByRegion() {
        if (selectedRegion != "") {
            const emailList = await getEmailsByRegion(selectedRegion);
            if (emailList.length > 0) {
                if (copyEmailsToClipboard(emailList)) {
                    setRegionMessage(emailList.length + " emails copied to clipboard");
                } else {
                    setRegionMessage("Something went wrong. Please reload the page and try again.");
                }
            } else {
                setRegionMessage("No emails to copy.");
            }
        }
    }

    function copyEmailsToClipboard(emailList) {
        return navigator.clipboard.writeText(emailList.toString()).then(
            () => {
                /* Failure */
                
                return true;
            },
            () => {
                /* Success */
                return false;
                
            },
        );
    }

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
                        <select id="university" name="university" className="input input-text" onChange={e => setSelectedUni(e.target.value)}>
                            <option value="" disabled selected>Select a university</option>
                            { (loaderData.universityList) ? loaderData.universityList.map((universityObj, idx) => <option key={"uni-" + idx} value={universityObj.university} >{universityObj.university}</option>) : <></>}
                        </select>
                        <button className="button ms-4" onClick={copyEmailsByUniversity}>Get emails</button>
                        <br />
                        <p className="text-sm text-secondary-dark">{uniMessage}</p>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="region" className="text-secondary-dark"><strong>Region</strong></label>
                        <br />
                        <select id="region" name="region" className="input input-text" onChange={e => setSelectedRegion(e.target.value)}>
                            <option value="" disabled selected>Select a region</option>
                            <option value="JHEASA">JHEASA</option>
                            <option value="AJCU-NA">AJCU - NA</option>
                            <option value="AUSJAL">AUSJAL</option>
                            <option value="KIRCHER">KIRCHER</option>
                            <option value="AJCU-AP">AJCU - AP</option>
                            <option value="AJCU-AM">AJCU - AM</option>
                        </select>
                        <button className="button ms-4" onClick={copyEmailsByRegion}>Get emails</button>
                        <br />
                        <p className="text-sm text-secondary-dark">{regionMessage}</p>
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