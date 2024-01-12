import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/lib/table';
import { useEffect, useState } from 'react';

import defaultConfig from './config';
import styles from './TableData.module.scss';

interface ITableProps extends TableProps<object> {
  reload?: number;
  clear?: boolean;
  paramSearch?: object;
  allowGetData: boolean;
  service: (params?: object) => Promise<object>;
  handleGetDataResponse: (res: object) => {
    content: [object];
    total: number;
  };
  getPaginationParam?: (page: number | undefined, pageSize: number | undefined) => object;
  convertDataSourceItem?: any;
  pagination?: IPagination | false;
}

export interface IPagination extends TablePaginationConfig {
  page?: number;
}

const TableData = ({ columns, ...props }: ITableProps) => {
  const [data, setData] = useState<object[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({ pageSize: 10 });

  const actionGetData = async ({ page }: IPagination = { pageSize: 10 }) => {
    const {
      allowGetData,
      paramSearch,
      service,
      handleGetDataResponse,
      getPaginationParam = defaultConfig.getPaginationParam,
    } = props;
    if (!service) {
      return;
    }
    if (loading || !allowGetData) {
      return;
    }
    setLoading(true);
    try {
      const res = await service({
        ...getPaginationParam(page, pagination.pageSize),
        ...paramSearch,
      });
      let { content, total } = handleGetDataResponse(res);
      if (props.convertDataSourceItem) {
        content = content.map(props.convertDataSourceItem) as any;
      }
      setData(content);
      setPagination((pagination) => ({ ...pagination, total, current: page }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const reloadTable = () => {
      setPagination((pagination) => ({
        ...pagination,
        current: 1,
      }));
      actionGetData();
    };
    reloadTable();
  }, [props.reload]);

  useEffect(() => {
    actionGetData();
  }, [JSON.stringify(props.paramSearch)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setData([]);
    setPagination({ pageSize: 10 });
  }, [props.clear]);

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    actionGetData({ page: paginationConfig.current });
  };

  const getTablePagination = (): any => {
    if (props.pagination !== undefined) {
      return props.pagination;
    }
    return pagination;
  };

  return (
    <Table
      className={styles.tableData}
      loading={loading}
      dataSource={data}
      columns={columns}
      onChange={handleTableChange}
      {...props}
      pagination={getTablePagination()}
    />
  );
};

TableData.defaultProps = {
  allowGetData: true,
  ...defaultConfig,
};

export default TableData;
