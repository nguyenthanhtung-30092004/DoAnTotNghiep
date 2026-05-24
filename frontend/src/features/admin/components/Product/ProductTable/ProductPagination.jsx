import AdminPagination from "../../common/AdminPagination";

const ProductPagination = ({ pagination, onPrev, onNext }) => {
  const page = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPage || 1;

  const handlePageChange = (nextPage) => {
    if (nextPage < page) {
      onPrev();
      return;
    }

    onNext();
  };

  return (
    <AdminPagination
      page={page}
      totalPages={totalPages}
      total={pagination?.totalProduct}
      limit={pagination?.limit}
      itemLabel="sản phẩm"
      onPageChange={handlePageChange}
      className="rounded-b-lg"
    />
  );
};

export default ProductPagination;
