import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu } from "../components/menu";
import { Pagination } from "../components/pagination";

// ---- Placeholder data (replace later with real backend data) ----
const PEOPLE = [
  {
    id: "1",
    name: "John Smith",
    title: "Professor",
    institution: "XIM University",
    email: "johnsmith@gmail.com",
    country: "India",
    school: "XIM University",
    major: "Computer Science",
    interests: "Human-computer interaction, education, systems",
    taskForceRole: "Task Force Member",
    taskForce: "Affiliated Task Force",
    region: "Asia",
  },
  {
    id: "2",
    name: "John Smith",
    title: "Researcher",
    institution: "XIM University",
    email: "johnsmith@gmail.com",
    country: "India",
    school: "XIM University",
    major: "Information Systems",
    interests: "Digital collaboration, web platforms",
    taskForceRole: "Task Force Member",
    taskForce: "Affiliated Task Force",
    region: "Asia",
  },
  {
    id: "3",
    name: "John Smith",
    title: "Professor",
    institution: "XIM University",
    email: "johnsmith@gmail.com",
    country: "India",
    school: "XIM University",
    major: "Computer Science",
    interests: "Human-computer interaction, education, systems",
    taskForceRole: "Task Force Member",
    taskForce: "Affiliated Task Force",
    region: "Asia",
  },
  {
    id: "4",
    name: "John Smith",
    title: "Professor",
    institution: "XIM University",
    email: "johnsmith@gmail.com",
    country: "India",
    school: "XIM University",
    major: "Computer Science",
    interests: "Human-computer interaction, education, systems",
    taskForceRole: "Task Force Member",
    taskForce: "Affiliated Task Force",
    region: "Asia",
  },
  {
    id: "5",
    name: "Jane Doe",
    title: "Dean",
    institution: "Santa Clara University",
    email: "janedoe@scu.edu",
    country: "USA",
    school: "Santa Clara University",
    major: "Engineering",
    interests: "Systems design, security, leadership",
    taskForceRole: "Task Force Lead",
    taskForce: "Governing Board",
    region: "North America",
  },
];

const PAGE_SIZE = 4; // Figma shows 4 cards on the page screenshot

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

export default function SearchRoute() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTaskForces, setSelectedTaskForces] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const taskForceOptions = useMemo(
    () => Array.from(new Set(PEOPLE.map((person) => person.taskForce))).sort(),
    []
  );
  const countryOptions = useMemo(
    () => Array.from(new Set(PEOPLE.map((person) => person.country))).sort(),
    []
  );
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PEOPLE.filter((person) => {
      const matchesQuery =
        !q ||
        person.name.toLowerCase().includes(q) ||
        person.title.toLowerCase().includes(q) ||
        person.institution.toLowerCase().includes(q) ||
        person.school.toLowerCase().includes(q) ||
        person.interests.toLowerCase().includes(q);

      const matchesTaskForce =
        selectedTaskForces.length === 0 || selectedTaskForces.includes(person.taskForce);
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
            Search people, university, research interests
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
              placeholder="Search people, university, research interests"
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
                Type a name, university, or research interest to find someone.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-md border-2 border-gray-light bg-white px-6 py-8 text-sm text-gray-dark/70">
              No results found. Try a different name, university, or research interest.
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
    </div>
  );
}

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-secondary-dark">{title}</div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option} className="checkbox">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            <p className="text-sm text-gray-dark/80">{formatFilterLabel(option)}</p>
          </label>
        ))}
      </div>
    </div>
  );
}

function PersonResultCard({ person }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/profile/${person.id}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`View profile for ${person.name}`}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className="grid cursor-pointer gap-6 rounded-md border-2 border-gray-light bg-teal-50 p-6 transition hover:shadow-md md:grid-cols-[260px_1fr_320px]"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white"
          aria-hidden="true"
        >
          <i className="bi bi-person-fill text-[40px] text-secondary-dark/70" aria-hidden="true" />
        </div>
        <div>
          <div className="text-lg font-semibold text-secondary-dark">{person.name}</div>
          <div className="mt-1 text-sm italic text-secondary-light">
            {person.title}, {person.institution}
          </div>
          <div className="text-sm text-gray-dark/70">{person.email}</div>
        </div>
      </div>

      <div className="grid gap-2 text-sm text-gray-dark/80 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="italic">
            Country <span className="text-gray-dark/60">{person.country}</span>
          </div>
          <div className="italic">
            School <span className="text-gray-dark/60">{person.school}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="italic">
            Major <span className="text-gray-dark/60">{person.major}</span>
          </div>
          <div className="italic">
            Research Interests <span className="text-gray-dark/60">{person.interests}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4">
        <div className="w-full max-w-[240px] rounded-md border-2 border-primary-light bg-white px-4 py-3 text-xs">
          <div className="font-semibold text-secondary-dark">{person.taskForceRole}:</div>
          <div className="mt-1 text-gray-dark/70">{person.taskForce}</div>
        </div>

        <button
          type="button"
          className="button flex w-full max-w-[240px] items-center justify-center gap-3 text-lg font-semibold"
          onClick={(event) => {
            event.stopPropagation();
            window.location.href = `mailto:${person.email}?subject=IAJES%20Connection`;
          }}
        >
          <i className="bi bi-envelope" aria-hidden="true" />
          Contact
        </button>
      </div>
    </div>
  );
}
