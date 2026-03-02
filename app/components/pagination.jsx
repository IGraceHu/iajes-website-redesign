export function Pagination({currentPage, setCurrentPage, totalItems, itemsPerPage = 10, pageRange = 5}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (pageRange % 2 == 0) { pageRange++; }
    let pagesStart = currentPage - Math.floor(pageRange / 2);
    let pagesEnd = currentPage + Math.floor(pageRange / 2);
    
    // pageStart is under 0
    if (pagesStart < 0) {
        pagesStart = 0;
        pagesEnd = pageRange - 1;
    // pageEnd is over total pages
    } else if (pagesEnd > totalPages - 1) {
        pagesEnd = totalPages - 1;
        pagesStart = totalPages - pageRange;
    }
    // Damage control
    if (pagesStart < 0) { pagesStart = 0; }
    if (pagesEnd > totalPages - 1) { pagesEnd = totalPages - 1; }
    

    const pagination = [];
    for (let i = pagesStart; i <= pagesEnd; i++) {
        if (i == currentPage) {
            pagination.push(<div key={i} className="bg-secondary-light w-10 flex items-center justify-center text-white rounded-md button-pg">{i + 1}</div>)
        } else {
            pagination.push(<button key={i} className="button button-pg button-light" onClick={() => setCurrentPage(i)}>{i + 1}</button>)
        }
    }
    
    return (
        <div className="flex justify-center space-x-2 p-4">
            { (currentPage == 0) && 
                <button className="button button-pg-arrow" disabled>
                    <i className="bi bi-arrow-left-short"></i>
                </button> }
            { (currentPage != 0) && 
                <button className="button button-pg-arrow" onClick={() => setCurrentPage(currentPage - 1)}>
                    <i className="bi bi-arrow-left-short"></i>
                </button> }
            {pagination}
            { (currentPage == totalPages - 1) && 
                <button className="button button-pg-arrow" disabled>
                    <i className="bi bi-arrow-right-short"></i>
                </button> }
            { (currentPage != totalPages - 1) && 
                <button className="button button-pg-arrow" onClick={() => setCurrentPage(currentPage + 1)}>
                    <i className="bi bi-arrow-right-short"></i>
                </button> }
        </div>
    )
}