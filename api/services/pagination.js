'use strict'

exports.paginate = function (Array, PaginationData) {
    
    if (PaginationData.Page > Math.ceil(Array.length / PaginationData.ItemsPerPage)) {
        PaginationData.Page = Math.ceil(Array.length / PaginationData.ItemsPerPage);
    }

    const Paginated = {
        List: Array.slice((PaginationData.Page - 1) * PaginationData.ItemsPerPage, PaginationData.Page * PaginationData.ItemsPerPage),
        Total: Array.length,
        Pages: Math.ceil(Array.length / PaginationData.ItemsPerPage)
    }

    return Paginated;
}