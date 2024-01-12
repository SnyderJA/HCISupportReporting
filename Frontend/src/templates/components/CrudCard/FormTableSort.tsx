import { MenuOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState } from 'react';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

export type FormTableSortProps = {
  rowKey: string;
  columns: any[];
  onSortEnd: any;
  convertDataResponse: any;
  convertDataSourceItem?: any;
  servicesSortGet: any;
};

const FormTableSort = ({ ...props }: FormTableSortProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const columnSort = {
    title: 'Sort',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  };

  useEffect(() => {
    actionGetData();
  }, []);

  const actionGetData = async () => {
    const { servicesSortGet } = props;
    if (!servicesSortGet) {
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      // TODO add params
      const res = await servicesSortGet();
      let { content } = props.convertDataResponse(res);
      if (props.convertDataSourceItem) {
        content = content.map(props.convertDataSourceItem) as any;
      }
      setData(content);
    } finally {
      setLoading(false);
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(data.slice(), oldIndex, newIndex).filter((el) => !!el);
      setData(newData);
      props.onSortEnd(newData);
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = data.findIndex((x) => x[props.rowKey] === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <Table
      pagination={false}
      dataSource={data}
      columns={[columnSort, ...props.columns]}
      rowKey={props.rowKey}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
};

export default FormTableSort;
