import React from "react";
import AdminPagination from "../common/AdminPagination";

const CategoryPagination = ({ pagination, onPageChange }) => {
  return (
    <AdminPagination
      page={pagination?.page}
      totalPages={pagination?.totalPages}
      total={pagination?.total}
      limit={pagination?.limit}
      itemLabel="danh mục"
      onPageChange={onPageChange}
    />
  );
};

export default CategoryPagination;
