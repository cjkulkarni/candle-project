'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

export default function Pagination({ currentPage, totalPages, onPageChange, hasMore }) {
    const pages = [];

    // If no totalPages provided, use hasMore logic
    const calculatedTotalPages = totalPages || (hasMore ? currentPage + 1 : currentPage);

    // Calculate page numbers to show
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(calculatedTotalPages, startPage + maxPagesToShow - 1);
    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {startPage > 1 && (
                <>
                    <Button
                        variant="outline"
                        onClick={() => onPageChange(1)}
                        className="min-w-[40px]"
                    >
                        1
                    </Button>
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => onPageChange(page)}
                    className="min-w-[40px]"
                >
                    {page}
                </Button>
            ))}

            {endPage < calculatedTotalPages && (
                <>
                    {endPage < calculatedTotalPages - 1 && <span className="px-2">...</span>}
                    <Button
                        variant="outline"
                        onClick={() => onPageChange(calculatedTotalPages)}
                        className="min-w-[40px]"
                    >
                        {calculatedTotalPages}
                    </Button>
                </>
            )}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= calculatedTotalPages}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
