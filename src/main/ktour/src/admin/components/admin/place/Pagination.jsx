import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({
    currentPage = 1,
    size = 10,
    totalElements = 0,
    onPageChange
}) {
    const totalPages =
        totalElements % size === 0
            ? totalElements / size
            : Math.floor(totalElements / size) + 1;

    const startBtn = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endBtn = Math.min(startBtn + 4, totalPages);

    const pages = [];
    for (let i = startBtn; i <= endBtn; i++) pages.push(i);

    return (
        <div className="pagination-controls" style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
            <button disabled={currentPage === 1} onClick={() => onPageChange(1)}><FontAwesomeIcon icon={faAnglesLeft} /></button>
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><FontAwesomeIcon icon={faAngleLeft} /></button>
            {pages.map(p => (
                <button key={p}
                    onClick={() => onPageChange(p)}
                    style={{ padding: "4px 8px", borderRadius: 4, background: p === currentPage ? "#4caf50" : "#fff", color: p === currentPage ? "#fff" : "#000" }}
                >
                    {p}
                </button>
            ))}
            <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><FontAwesomeIcon icon={faAngleRight} /></button>
            <button disabled={currentPage >= totalPages} onClick={() => onPageChange(totalPages)}><FontAwesomeIcon icon={faAnglesRight} /></button>
        </div>
    );
}