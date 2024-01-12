import { EditOutlined } from '@ant-design/icons';
import { Button, ButtonProps, notification } from 'antd';
import { useEffect, useState } from 'react';

import { camelCaseToSentenceCase, capitalizeFirstLetter } from '@/templates/utils/format.util';
import { getQueryParams, getSearchFromHref } from '@/templates/utils/url.util';

import BtnDeleteConfirm from '../Btn/BtnDeleteConfirm';
import Card from '../Card';
import useFormModal from '../FormRender/useFormModal';
import TableData, { IPagination } from '../Table/TableData';
import styles from './CrudCard.module.scss';
import FormSearch from './FormSearch';
import { Rule } from '@/templates/utils/validate-rules.util';
import Btn from '../Btn/Btn';
import { useTenant } from '@/templates/tenants/useTenant';
import FormTableSort from './FormTableSort';
import BreadcrumbData from './BreadcrumbData';
import type { ColumnsType } from 'antd/lib/table';

export type CrudModel = {
  name?: string;
  form: {
    component?: React.ReactNode | ((props: any) => JSX.Element);
    render?: any;
    rules?: Rule[];
  };
  table?: {
    render?: any;
  };
};

export interface CrudModelField extends CrudModel {
  field: string;
}

export type ActionProps = {
  edit?: ButtonProps;
  delete?: ButtonProps;
};

export type ColumnItem = {
  title: string;
  render: (_: any, record: any) => React.ReactNode,
}

export type TableColumnConfig = Array<string | ColumnItem>

export type CrudCardProps = {
  title: string;
  getPageState?: (()=> Promise<any>),
  model: { [key: string]: CrudModel } | (({pageState}:{pageState: any}) => Promise<{ [key: string]: CrudModel }>);
  form: {
    saveItems: string[];
    convertFormValue?: any;
  };
  table: {
    formSearch: string[];
    columns: TableColumnConfig | (({ pageState, model }:{ pageState: any, model: { [key: string]: CrudModel } }) => Promise<TableColumnConfig>);
    extraActions?: any;
    setBtnActionProps?: (record: any) => ActionProps;
    convertDataSourceItem?: any;
    convertDataResponse?: any;
    convertPaginationParam?: any;
    pagination?: IPagination | false;
    rowKey?: any;
  };
  services: {
    create: any;
    get: any;
    update: any;
    delete: any;
    sortGet?: any;
    sortUpdate?: any;
    getBreadcrumbData?: any;
  };
};

const CrudCard = ({ ...props }: CrudCardProps) => {
  const [pageState, setPageState] = useState<any>(undefined);
  const [isShowFormTableSort, setIsShowFormTableSort] = useState(false);
  const [dataSortEnd, setDataSortEnd] = useState([]);
  const [model, setModel] = useState<{ [key: string]: CrudModel }>();
  const [tableColumnConfig, setTableColumnConfig] = useState<any>([])
  const tenant = useTenant();
  // form search
  const [paramSearch, setParamSearch] = useState({});
  const [reload, setReload] = useState(0);
  const queryParamSearch = getSearchFromHref();

  useEffect(()=> {
    (async () => {
      if (typeof props.getPageState === 'function') {
        const pageState = await props.getPageState();
        setPageState(pageState)
      } else {
        setPageState({});
      }
     
    })();
  }, [props.getPageState])

  useEffect(() => {
    if (!pageState) {
      return;
    }
    (async () => {
      if (typeof props.model === 'function') {
        const modelResult = await props.model({pageState});
        setModel(modelResult);
      } else {
        setModel(props.model);
      }
    })();
  }, [props.model, pageState]);

  useEffect(() => {
    if (!pageState) {
      return;
    }
    if (!model) {
      return
    }
    (async () => {
      if (typeof props.table.columns === 'function') {
        const columnsResult = await props.table.columns({pageState, model});
        setTableColumnConfig(columnsResult);
      } else {
        setTableColumnConfig(props.table.columns);
      }
    })();
  }, [model, props.table.columns, pageState]);

  const handleChangeQueryParams = () => {
    setParamSearch(getQueryParams());
  };

  useEffect(() => {
    handleChangeQueryParams();
  }, [queryParamSearch]);

  const modelObject: any = Object.keys(model || {}).reduce((obj: any, field: string) => {
    const item: CrudModelField = (model || {})[field] as any;
    item.field = field;
    let name = item.name;
    if (!name) {
      name = camelCaseToSentenceCase(item.field);
    }
    obj[item.field] = { ...item, name };
    return obj;
  }, {});

  // end form search

  // table

  const tableColumns = tableColumnConfig.map((item: any) => {
    if (typeof item === 'string' && modelObject[item]) {
      const modelField = modelObject[item];
      const colConfig: any = {
        title: modelField.name,
        dataIndex: item,
        key: item,
      };
      if (modelObject[item].table?.render) {
        colConfig.render = (text: any, record: any) => {
          return modelObject[item].table?.render(text, record);
        };
      } else if (modelObject[item].enumValue) {
        colConfig.render = (text: any, record: any) => {
          if (!text) {
            return '';
          }
          const enumValue = modelObject[item].enumValue;
          const getLabel = (value: any) => {
            if (enumValue[value]) {
              return enumValue[value].label || '';
            }
            return value;
          };
          if (Array.isArray(text)) {
            return text.map((item) => getLabel(item)).join(', ');
          }
          return getLabel(text);
        };
      }
      return colConfig;
    }
    if (typeof item === 'function') {
      return item({model})
    }
    return item;
  });

  const reloadTable = () => {
    setReload(reload + 1);
  };

  const actionColumns = {
    title: '',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (text: any, record: any) => {
      const { setBtnActionProps } = props.table;
      let customProps = {} as ActionProps;
      if (setBtnActionProps) {
        customProps = setBtnActionProps(record);
      }
      return (
        <div className={styles.colAction}>
          {props.services.update && (
            <Button
              onClick={() => {
                showFormSave({ ...record, FORM_MODE: 'EDIT' });
              }}
              type="primary"
              {...(customProps.edit || {})}
            >
              <EditOutlined />
            </Button>
          )}
          {props.services.delete && (
            <BtnDeleteConfirm
              {...(customProps.delete || ({} as any))}
              onConfirm={async () => {
                try {
                  const res = await props.services.delete(record);
                  if (Array.isArray(res) && res[0]) {
                    throw res[0];
                  }
                  notification.success({
                    message: 'Delete successfully',
                  });
                  reloadTable();
                } catch (e: any) {
                  console.error(e);
                  notification.error({
                    message: `Delete error`,
                    description: e.response?.data?.message || e.message || 'Something when wrong!',
                  });
                }
              }}
            />
          )}
          {props.table.extraActions && props.table.extraActions(record, { reloadTable })}
        </div>
      );
    },
  };
  // end table

  // form modal
  const formItemsRender = props.form.saveItems
    .filter((item) => modelObject[item])
    .map((item: any) => {
      let component = modelObject[item].form.component;
      if (modelObject[item].enumValue && typeof modelObject[item].form.component === 'function') {
        component = component({ data: Object.values(modelObject[item].enumValue) });
      }
      return {
        field: item,
        label: modelObject[item].name,
        component: component,
        render: modelObject[item].formItemRender,
        rules: modelObject[item].form.rules,
        customFormItem: modelObject[item].customFormItem,
      };
    });

  const handleSubmitFormModal = async (values: any) => {
    const { FORM_MODE = 'CREATE' } = values;
    try {
      if (props.form.convertFormValue) {
        // eslint-disable-next-line no-param-reassign
        values = props.form.convertFormValue(values);
      }

      let error;
      if (FORM_MODE === 'EDIT') {
        error = await props.services.update(values);
      } else {
        error = await props.services.create(values);
      }

      if (Array.isArray(error) && error[0]) {
        throw error[0];
      }

      notification.success({
        message: `${capitalizeFirstLetter(FORM_MODE)} success`,
      });
      setReload(reload + 1);
    } catch (e: any) {
      console.error(e);
      notification.error({
        message: `${capitalizeFirstLetter(FORM_MODE)} error`,
        description: e.response?.data?.message || e.message || 'Something when wrong!',
      });
      throw e;
    }
  };
  const { Modal: FormSaveModal, show: showFormSave } = useFormModal({
    title: props.title,
    onFinish: handleSubmitFormModal,
    formRender: {
      items: formItemsRender,
      footerItems: [
        <Btn type="primary" htmlType="submit" key="buttonSubmit">
          Submit
        </Btn>,
      ],
    },
  });
  // end form modal
  const tableConvertDataResponse =
    tenant.config.CRUD_CARD.SERVICES?.tableConvertDataResponse || props.table.convertDataResponse;
  const tableConvertPaginationParam =
    tenant.config.CRUD_CARD.SERVICES?.tableConvertPaginationParam ||
    props.table.convertPaginationParam;
  if (!model && tableColumnConfig.length === 0) {
    return null;
  }

  return (
    <div className={styles.crudCard}>
      <Card {...props}>
        <div style={{ textAlign: 'right', position: 'absolute', top: 10, right: 20 }}>
          {!isShowFormTableSort ? (
            <>
              {' '}
              <Button
                onClick={() => {
                  showFormSave({ FORM_MODE: 'CREATE' });
                }}
                type="primary"
              >
                Add
              </Button>
              {props.services.sortGet && (
                <Button
                  onClick={() => {
                    setIsShowFormTableSort(true);
                  }}
                  type="primary"
                >
                  Sort
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsShowFormTableSort(false);
                }}
                type="default"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (dataSortEnd.length > 0) {
                    await props.services.sortUpdate(dataSortEnd);
                  }
                  setIsShowFormTableSort(false);
                }}
                type="primary"
              >
                Save
              </Button>
            </>
          )}
        </div>
        {props.services.getBreadcrumbData && (
          <div>
            <BreadcrumbData service={props.services.getBreadcrumbData} />
          </div>
        )}
        {props.table.formSearch && props.table.formSearch.length > 0 && (
          <div className={styles.formSearch}>
            <FormSearch items={props.table.formSearch || []} />
          </div>
        )}
        <div>
          {!isShowFormTableSort ? (
            <TableData
              rowKey={props.table.rowKey || 'id'}
              reload={reload}
              paramSearch={paramSearch}
              columns={[...tableColumns, actionColumns]}
              service={props.services.get}
              handleGetDataResponse={tableConvertDataResponse}
              convertDataSourceItem={props.table.convertDataSourceItem}
              pagination={props.table.pagination}
              getPaginationParam={tableConvertPaginationParam}
            />
          ) : (
            <FormTableSort
              rowKey={props.table.rowKey || 'id'}
              convertDataResponse={tableConvertDataResponse}
              convertDataSourceItem={props.table.convertDataSourceItem}
              servicesSortGet={props.services.sortGet}
              columns={tableColumnConfig}
              onSortEnd={setDataSortEnd}
            />
          )}
        </div>
        <div>
          <FormSaveModal />
        </div>
      </Card>
    </div>
  );
};

export default CrudCard;
