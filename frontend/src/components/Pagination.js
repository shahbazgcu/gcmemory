import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPageButtons = 5; // Maximum number of page buttons to display
  
  // Calculate which page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  
  // Adjust if we're near the end of the page range
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  // Generate page numbers array
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <BSPagination className="custom-pagination justify-content-center my-4">
      <BSPagination.First 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1} 
      />
      
      <BSPagination.Prev 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      
      {startPage > 1 && (
        <>
          <BSPagination.Item onClick={() => onPageChange(1)}>1</BSPagination.Item>
          {startPage > 2 && <BSPagination.Ellipsis disabled />}
        </>
      )}
      
      {pageNumbers.map(number => (
        <BSPagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </BSPagination.Item>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <BSPagination.Ellipsis disabled />}
          <BSPagination.Item onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </BSPagination.Item>
        </>
      )}
      
      <BSPagination.Next 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
      
      <BSPagination.Last 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages} 
      />
    </BSPagination>
  );
};

export default Pagination;