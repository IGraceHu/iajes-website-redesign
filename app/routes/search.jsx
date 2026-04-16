import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Pagination } from "../components/pagination";
import { Footer } from "../components/footer";

export function meta() {
  return [
    { title: "People" },
    { name: "", content: "" },
  ];
}

async function getPeople() {
  const { data, error } = await supabase
    .from('users')
    .select('id, fname, lname, email, image_url, job_position, languages, country, institution, major, research_interests, task_force_role, task_force')
    
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

export default function SearchRoute({ loaderData }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTaskForces, setSelectedTaskForces] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const taskForceOptionsSet = new Set(loaderData.map((person) => { return (person.task_force != "") ? person.task_force : null }));
  taskForceOptionsSet.delete(null);

  const countryOptionsSet = new Set(loaderData.map((person) => { return (person.country != "") ? person.country : null }));
  countryOptionsSet.delete(null);

  const taskForceOptions = useMemo(
    () => Array.from(taskForceOptionsSet).sort(),
    []
  );
  const countryOptions = useMemo(
    () => Array.from(countryOptionsSet).sort(),
    []
  );


  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return loaderData.filter((person) => {

      const matchesQuery =
        !q ||
        person?.fname?.toLowerCase().includes(q) ||
        person?.institution?.toLowerCase().includes(q) ||
        person?.interests?.toLowerCase().includes(q);

      const matchesTaskForce =
        selectedTaskForces.length === 0 || selectedTaskForces.includes(person.task_force);
      const matchesCountry =
        selectedCountries.length === 0 || selectedCountries.includes(person.country);

      return matchesQuery && matchesTaskForce && matchesCountry;
    });
  }, [query, selectedTaskForces, selectedCountries]);

  // Reset to page 1 whenever query or filters change
  useEffect(() => {
    setPage(0);
  }, [query, selectedTaskForces, selectedCountries]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const startIdx = page * PAGE_SIZE;
  const pageResults = results.slice(startIdx, startIdx + PAGE_SIZE);

  // If results shrink and current page becomes invalid
  useEffect(() => {
    const lastPageIndex = Math.max(0, totalPages - 1);
    if (page > lastPageIndex) setPage(0);
  }, [page, totalPages]);

  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = selectedTaskForces.length > 0 || selectedCountries.length > 0;
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
          <div className="flex w-full max-w-[380px] items-center gap-2 rounded-md border-2 border-primary-light bg-white px-4 py-2 focus-within:bg-teal-50">
            <i className="bi bi-search text-gray-dark/60" aria-hidden="true" />
            <input
              value={query}
              onChange={handleQueryChange}
              onInput={handleQueryChange}
              placeholder="Search people, institutions, or research interests"
              className="w-full bg-transparent text-sm text-gray-dark outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
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
          className={`origin-top overflow-hidden transition-all duration-300 ease-out ${
            showFilters
              ? "mt-4 max-h-[800px] translate-y-0 opacity-100 pointer-events-auto"
              : "mt-0 max-h-0 -translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="rounded-md border-2 border-gray-light bg-white p-4">
            <fieldset disabled={!showFilters} className="grid gap-6 md:grid-cols-2">
              <FilterGroup
                title="Task Force"
                options={taskForceOptions}
                selected={selectedTaskForces}
                onToggle={(value) => toggleSelection(setSelectedTaskForces, value)}
              />
              <FilterGroup
                title="Country"
                options={countryOptions}
                selected={selectedCountries}
                onToggle={(value) => toggleSelection(setSelectedCountries, value)}
              />
            </fieldset>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {isEmptyState ? (
            <div className="rounded-md border-2 border-gray-light bg-white px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                <i className="bi bi-people-fill text-[36px] text-primary-dark" aria-hidden="true" />
              </div>
              <div className="text-lg font-semibold text-secondary-light">Start searching</div>
              <div className="mt-2 text-sm text-gray-dark/70">
                Type a name, institution, or research interest to find someone.
              </div>
            </div>
          ) : results.length === 0 ? (
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
  return (
    <div>
      <div className="mb-3 font-semibold text-secondary-dark">{title}</div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option} className="checkbox">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            <p className="text-gray-dark/80">{formatFilterLabel(option)}</p>
          </label>
        ))}
      </div>
    </div>
  );
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
      className="grid cursor-pointer gap-6 rounded-md border-2 border-gray-light bg-teal-50 p-6 transition hover:shadow-md md:grid-cols-3"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white"
          aria-hidden="true"
        >
          <i className="bi bi-person-fill text-[40px] text-secondary-dark/70" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-semibold text-secondary-dark">{person.fname} {person.lname}</div>
          <div className="my-1 italic text-secondary-light">
            {person?.job_position && <span>{person.job_position}, </span> } {person.institution}
          </div>
          <div className="text-sm text-gray-dark/70">{person.email}</div>
        </div>
      </div>

      <div className="grid text-sm text-gray-dark/80 grid-cols-2 gap-2 italic">
        { person?.country &&
          <div className="">
            <span className="mr-1">Country</span> <span className="font-semibold text-secondary-dark">{person.country}</span>
          </div>
        }
        { person?.languages &&
          <div className="">
            <span className="mr-1">Languages</span> <span className="font-semibold text-secondary-dark">{person.languages}</span>
          </div>
        }
        { person?.major &&
          <div className="">
            <span className="mr-1">Major</span> <span className="font-semibold text-secondary-dark">{person.major}</span>
          </div>
        }
        { person?.research_interests &&
          <div className="">
            <span className="mr-1">Research Interests</span> <span className="font-semibold text-secondary-dark">{person.research_interests}</span>
          </div>
        }
      </div>
      <div>
        { person.task_force && 
        <div className="w-full rounded-md border-2 border-primary-light bg-white px-4 py-3 text-xs">
          <div className="font-semibold text-secondary-dark">{person.task_force_role}:</div>
          <div className="mt-1 text-gray-dark/70">{person.task_force}</div>
        </div> 
        }
      </div>
      
    </a>
  );
}
