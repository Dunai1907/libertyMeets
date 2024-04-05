import { Pagination } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Pagination.module.scss";

type PaginationForPostsProps = {
  totalCount: number;
  category?: string | undefined;
  appUrl: string;
  postsPerPage: number;
  changePage: (page: number) => void;
};

export function PaginationForPosts({
  totalCount,
  postsPerPage,
  changePage,
}: PaginationForPostsProps) {
  const [current, setCurrent] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    if (router.query?.page) {
      setCurrent(Number(router.query?.page));
    }
  }, [router.query?.page]);

  if (postsPerPage >= totalCount) {
    return null;
  }

  return (
    <Pagination
      className={styles.pagination}
      current={current}
      onChange={(page) => {
        changePage(page);
        setCurrent(page);
      }}
      total={totalCount}
      defaultPageSize={postsPerPage}
      showLessItems={true}
      responsive={true}
      itemRender={(page, type, element) => {
        return (
          <>
            {page === current ? (
              <span
                className="active"
                style={{
                  display: "inline-block",
                  backgroundColor: "#921A64",
                  borderRadius: "50%",
                  color: "#ffffff",
                  fontSize: "14px",
                  width: "24px",
                  margin: "auto",
                }}
              >
                {element}
              </span>
            ) : (
              <div>{element}</div>
            )}
          </>
        );
      }}
    />
  );
}
