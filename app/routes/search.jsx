import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { checkCurrentAuth, currentHasPermissions, getUserVerified } from "../helpers/permissions";
import { Menu } from "../components/menu";
import { MultiSelect } from "../components/multi-select";
import { Pagination } from "../components/pagination";
import { Footer } from "../components/footer";

export function meta() {
  return [
    { title: "People" },
    { name: "", content: "" },
  ];
}

const roleNames = new Map([
  ["member", "Member"],
  ["admin-super", "Superadmin"],
  ["admin-region-jheasa", "Regional Representative (JHEASA)"],
  ["admin-region-ajcu-na", "Regional Representative (AJCU-NA)"],
  ["admin-region-ausjal", "Regional Representative (AUSJAL)"],
  ["admin-region-kircher", "Regional Representative (KIRCHER)"],
  ["admin-region-ajcu-ap", "Regional Representative (AJCU-AP)"],
  ["admin-region-ajcu-am", "Regional Representative (AJCU-AM)"],
  ["admin-tf-rac", "TF Admin (Research & Academic Cooperation)"],
  ["admin-tf-wis", "TF Admin (Women in STEM)"],
  ["admin-tf-hea", "TF Admin (Health)"],
  ["admin-tf-aih", "TF Admin (Artificial Intelligence & Humanity)"],
  ["admin-tf-esj", "TF Admin (Engineering & Social Justice)"],
  ["admin-tf-htfi", "TF Admin (Humanitarian Tech & Frugal Innovation)"],
  ["admin-tf-infr", "TF Admin (Infrastructure)"],
  ["admin-tf-ene", "TF Admin (Energy)"],
  ["admin-newsletter", "Newsletter Admin"],
  ["admin-resources", "Resources Admin"],
  ["admin-university", "University Representative"]
]);

async function getPeople() {
  const { data, error } = await supabase
    .from('users')
    .select('id, fname, lname, roles, is_seen_by_visitors, engineering_type, position_type, title, tech_interests, general_interests, country, university, region');
  if (data) {
    for (let i = 0; i < data.length; i++) {
      data[i].fname = data[i].fname || "";
      data[i].lname = data[i].lname || "";
      data[i].roles = data[i].roles || ["member"];
      data[i].is_seen_by_visitors = data[i].is_seen_by_visitors;

      data[i].engineering_type = data[i].engineering_type || [];
      data[i].position_type = data[i].position_type || [];
      data[i].title = data[i].title || ""
      data[i].tech_interests = data[i].tech_interests || [];
      data[i].general_interests = data[i].general_interests || [];
      
      data[i].university = data[i].university || "";
      data[i].country = data[i].country || "";
      data[i].region = data[i].region || "";
    }
    data.sort((a, b) => { return `${a.fname} ${a.lname}` > `${b.fname} ${b.lname}` ? 1 : -1 });
  }
  return data || error;
}

const PAGE_SIZE = 8; 

const formatFilterLabel = (value) => {
  if (!value) return value;
  return value
    .split(" ")
    .map((word) => {
      if (!word) return word;
      if (word === word.toUpperCase()) return word;
      return word
        .split("-")
        .map((part) => {
          if (!part) return part;
          if (part === part.toUpperCase()) return part;
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("-");
    })
    .join(" ");
};

export async function loader({}) {
  return getPeople();
}

const allowedRoles = ["admin-university", "admin-region-jheasa", "admin-region-ajcu-na", "admin-region-ausjal", "admin-region-kircher", "admin-region-ajcu-ap", "admin-region-ajcu-am"]

export default function SearchRoute({ loaderData }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        currentHasPermissions(session?.user.id, allowedRoles).then(
            function (hasPermissions) { setIsAdmin(hasPermissions); }
        );
        if (session?.user.id) {
          getUserVerified(session?.user.id).then(
            function (verified) {setIsVerified(verified)}
          )
        }
      });
  
      // Check current session on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        currentHasPermissions(session?.user.id, allowedRoles).then(
            function (hasPermissions) { setIsAdmin(hasPermissions); }
        );
        if (session?.user.id) {
          getUserVerified(session?.user.id).then(
            function (verified) {setIsVerified(verified)}
          )
        }
        if (searchParams.get('new') && (session?.user.id == basePerson?.id)) {
        setShowPopup(true);
      }
      });
  
      return () => subscription.unsubscribe();
  }, []);


  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [selectedEngineering, setSelectedEngineering] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);


  const countryOptionsSet = new Set();
  const universityOptionsSet = new Set();
  const engineeringOptionSet = new Set();

  for (let person of loaderData) {
    countryOptionsSet.add(person.country);
    universityOptionsSet.add(person.university);
    for (let engineering of person.engineering_type) {
      engineeringOptionSet.add(engineering);
    }
  }

  countryOptionsSet.delete(null);
  countryOptionsSet.delete("");
  universityOptionsSet.delete(null);
  universityOptionsSet.delete("");
  engineeringOptionSet.delete(null);
  engineeringOptionSet.delete("");


  const countryOptions = useMemo(
    () => Array.from(countryOptionsSet).sort(),
    []
  );
  const universityOptions = useMemo(
    () => Array.from(universityOptionsSet).sort(),
    []
  );
  const engineeringOptions = useMemo(
    () => Array.from(engineeringOptionSet).sort(),
    []
  );

  function includesElements(baseArray, includeArray) {
    for (let arrayItem of includeArray) {
      if (baseArray.includes(arrayItem)) {
        return true;
      }
    }
    return false;
  }


  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return loaderData.filter((person) => {
      const isSeen = isVerified || person.is_seen_by_visitors;

      const matchesQuery =
        !q ||
        person?.fname?.toLowerCase().includes(q) ||
        person?.lname?.toLowerCase().includes(q) ||
        person?.university?.toLowerCase().includes(q) ||
        person?.engineering_type?.toLowerCase().includes(q) ||
        person?.languages?.toLowerCase().includes(q) ||
        person?.tech_interests?.toLowerCase().includes(q);

      const matchesRegion =
        selectedRegion.length === 0 || selectedRegion.includes(person.region);
      const matchesCountry =
        selectedCountries.length === 0 || selectedCountries.includes(person.country);
      const matchesUniversity =
        selectedUniversities.length === 0 || selectedUniversities.includes(person.university);
      const matchesEngineering =
        selectedEngineering.length === 0 || includesElements(selectedEngineering, person.engineering_type);

      return isSeen && matchesQuery && matchesCountry && matchesUniversity && matchesEngineering && matchesRegion;
    });
  }, [query, selectedCountries, selectedUniversities, selectedEngineering, selectedRegion]);

  // Reset to page 1 whenever query or filters change
  useEffect(() => {
    setPage(0);
  }, [query, selectedCountries, selectedUniversities, selectedEngineering, selectedRegion]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const startIdx = page * PAGE_SIZE;
  const pageResults = results.slice(startIdx, startIdx + PAGE_SIZE);

  // If results shrink and current page becomes invalid
  useEffect(() => {
    const lastPageIndex = Math.max(0, totalPages - 1);
    if (page > lastPageIndex) setPage(0);
  }, [page, totalPages]);

  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = (selectedCountries.length > 0) || (selectedUniversities.length > 0) || (selectedEngineering.length > 0);
  const showHeader = hasQuery || hasActiveFilters;
  const isEmptyState = !showHeader;

  const toggleSelection = (setState, value) => {
    setState((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleQueryChange = (event) => {
    const value = event.currentTarget.value;
    if (value !== query) {
      setQuery(value);
    }
  };

  function onCountryChange(countrySelected) {
    setSelectedCountries(countrySelected);
  }

  function onUniversityChange(universitySelected) {
    setSelectedUniversities(universitySelected);
  }

  function onEngineeringChange(engineeringSelected) {
    setSelectedEngineering(engineeringSelected);
  }

  return (
    <div className="min-h-screen bg-white">
      <Menu />

      <div className="mx-auto max-w-[1100px] px-6 pb-20 pt-10">
        <div className="text-center">
          <h2 className="mb-2 normal-case text-primary-dark">
            Search People
          </h2>
          <p
            className={`text-sm text-gray-dark/70 transition-opacity duration-200 ${
              showHeader ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!showHeader}
          >
            {results.length} result{results.length === 1 ? "" : "s"} found
            {hasQuery ? ` for \"${query.trim()}\"` : ""}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex w-full max-w-[450px] items-center gap-2 rounded-md border-2 border-primary-light bg-white px-4 py-2 focus-within:bg-teal-50">
            <i className="bi bi-search text-gray-dark/60" aria-hidden="true" />
            <input
              id="search-input"
              value={query}
              onChange={handleQueryChange}
              onInput={handleQueryChange}
              placeholder="Search people, institutions, or research interests"
              className="w-full bg-transparent text-sm text-gray-dark outline-none"
            />
            <button className="size-5 duration-200 relative hover:cursor-pointer hover:text-primary-dark text-gray-dark/60"
                    onClick={() => {document.getElementById("search-input").value = ""; setQuery("");}}>
              <i className="bi bi-x text-[1.5rem] absolute -top-2 -left-1" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            { isAdmin && 
              <a
                href="/admin-options/contact"
                className="button"
              >
                Mass Contact
              </a>
            }
            <button
              type="button"
              className="button button-light flex items-center gap-2 text-sm font-semibold"
              onClick={() => setShowFilters((prev) => !prev)}
              aria-expanded={showFilters}
              aria-controls="search-filters"
            >
              <i className="bi bi-funnel" aria-hidden="true" />
              Filter
            </button>
          </div>
        </div>

        <div
          id="search-filters"
          aria-hidden={!showFilters}
          className={`origin-top overflow-hidden transition-all duration-300 ease-out rounded-md border-2 border-gray-light bg-white p-4 ${
            showFilters
              ? "mt-4 max-h-[1000px] translate-y-0 opacity-100 pointer-events-auto  overflow-y-auto"
              : "mt-0 max-h-0 -translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="">
            <fieldset disabled={!showFilters} className="grid gap-6 md:grid-cols-3 grid-cols-1">
              <div className="md:col-span-3">
                <div className="mb-3 font-semibold text-secondary-dark">Region</div>
                <div className="flex flex-wrap gap-2">
                  <label className="checkbox">
                    <input type="checkbox" checked={selectedRegion.includes("JHEASA")} onChange={() => toggleSelection(setSelectedRegion, "JHEASA")} />
                    <p className="text-gray-dark/80">JHEASA</p>
                  </label>

                  <label className="checkbox">
                    <input type="checkbox" checked={selectedRegion.includes("AJCU-NA")} onChange={() => toggleSelection(setSelectedRegion, "AJCU-NA")} />
                    <p className="text-gray-dark/80">AJCU - NA</p>
                  </label>

                  <label className="checkbox">
                    <input type="checkbox" checked={selectedRegion.includes("AUSJAL")} onChange={() => toggleSelection(setSelectedRegion, "AUSJAL")} />
                    <p className="text-gray-dark/80">AUSJAL</p>
                  </label>

                  <label className="checkbox">
                    <input type="checkbox" checked={selectedRegion.includes("KIRCHER")} onChange={() => toggleSelection(setSelectedRegion, "KIRCHER")} />
                    <p className="text-gray-dark/80">KIRCHER</p>
                  </label>

                  <label className="checkbox">
                    <input type="checkbox" checked={selectedRegion.includes("AJCU-AP")} onChange={() => toggleSelection(setSelectedRegion, "AJCU-AP")} />
                    <p className="text-gray-dark/80">AJCU - AP</p>
                  </label>

                  <label className="checkbox">
                    <input type="checkbox" checked={selectedRegion.includes("AJCU-AM")} onChange={() => toggleSelection(setSelectedRegion, "AJCU-AM")} />
                    <p className="text-gray-dark/80">AJCU - AM</p>
                  </label>
                </div>
              </div>

              <div>
                <p className="font-semibold text-secondary-dark">Type of Engineering</p>
                <MultiSelect
                  name="engineering"
                  selected={selectedEngineering}
                  onChange={onEngineeringChange}
                  className="w-full"
                  size="5"
                >
                  { (engineeringOptions) ? engineeringOptions.map((engineering, idx) => <option key={"eng-" + idx} value={engineering}>{engineering}</option>) : <></>}
                </MultiSelect>
              </div>
              
              <div>
                <p className="font-semibold text-secondary-dark">Country</p>
                <MultiSelect
                  name="country"
                  selected={selectedCountries}
                  onChange={onCountryChange}
                  className="w-full"
                  size="5"
                >
                  { (countryOptions) ? countryOptions.map((country, idx) => <option key={"cou-" + idx} value={country}>{country}</option>) : <></>}
                </MultiSelect>
              </div>

              <div>
                <p className="font-semibold text-secondary-dark">University</p>
                <MultiSelect
                  name="university"
                  selected={selectedUniversities}
                  onChange={onUniversityChange}
                  className="w-full"
                  size="5"
                >
                  { (universityOptions) ? universityOptions.map((university, idx) => <option key={"uni-" + idx} value={university}>{university}</option>) : <></>}
                </MultiSelect>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          { results.length === 0 ? (
            <div className="rounded-md border-2 border-gray-light bg-white px-6 py-8 text-sm text-gray-dark/70">
              No results found. Try a different name, institution, or research interest.
            </div>
          ) : (
            <>
              {pageResults.map((person) => (
                <PersonResultCard key={person.id} person={person} />
              ))}

              {totalPages > 1 ? (
                <Pagination
                  currentPage={page}
                  setCurrentPage={setPage}
                  totalItems={results.length}
                  itemsPerPage={PAGE_SIZE}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FilterGroup({ title, options, selected, onToggle }) {
  if (options.length > 0) {
    return (
      <div>
        <div className="mb-3 font-semibold text-secondary-dark">{title}</div>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <label key={option} className="checkbox">
              <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)}
              />
              <p className="text-gray-dark/80">{formatFilterLabel(option)}</p>
            </label>
          ))}
        </div>
      </div>
    );
  }
}

function PersonResultCard({ person }) {
  return (
    <a
      href={`/profile/${person.id}`}
      role="link"
      tabIndex={0}
      aria-label={`View profile for ${person.fname}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className="grid cursor-pointer gap-6 rounded-md border-2 border-gray-light bg-teal-50 p-6 transition hover:shadow-md md:grid-cols-[310px_auto]"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex shrink-0 h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-light border-primary-dark border-3 border-box"
          aria-hidden="true"
        >
          {person.image_url ? (
            <img
              src={person.image_url}
              alt={`${person.fname} ${person.lname}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="bi bi-person-fill text-[40px] text-secondary-dark/60" aria-hidden="true" />
          )}
        </div>

        <div>
          <div className="text-xl font-semibold text-secondary-dark mb-2">{person.fname} {person.lname}</div>
          <div className="">
            {person.roles.map((role, idx) => {
                if (role.startsWith("admin-region") || role.startsWith("admin-university")) {
                    return <div key={"role-" + idx} className="text-xs inline-block me-2 mb-2 px-2 py-1 shrink-0 text-secondary-light border-2 border-primary-light border-2 rounded-md">{roleNames.get(role)}</div>
                }
            })}
          </div>
          <p className="text-disabled-dark">{person.title}</p>
          <div className="mb-1 italic text-secondary-light">
            {person.university}
          </div>
        </div>
      </div>
      
      <div>
        <div className="pb-2 border-b-2 border-gray-light grid md:grid-cols-2 grid-cols-1 gap-x-2">
            <p className="font-semibold text-secondary-dark">
              {person.engineering_type.map((engineering, idx) => {
                return (idx > 0) ? ", " + engineering : engineering;
              })}
            </p>

            <p>
              {person.country}{(person.country.length > 0 && person.region.length > 0) && (" — ") }<span className="font-semibold text-secondary-dark">{person.region}</span>
            </p>

            <p className="text-sm text-gray-dark/70">
              {person.position_type.map((position, idx) => {
                  return (idx > 0) ? ", " + position : position;
              })}
            </p>

          </div>

          <div className="mt-2">
            { (person.tech_interests.length > 0 || person.general_interests.length > 0) && 
              <div className="flex flex-wrap">
                { (person.tech_interests.length > 0) &&
                <ul className="mr-12">
                  {person.tech_interests.map((interest, idx) => {
                    return <li key={"tech-" + idx}>{interest}</li>
                  })}
                </ul>
                }
                <ul className="mr-12">
                  {person.general_interests.map((interest, idx) => {
                    return <li key={"tech-" + idx}>{interest}</li>
                  })}
                </ul>
              </div>
              }
          </div>
      </div>
      
      
      
    </a>
  );
}
