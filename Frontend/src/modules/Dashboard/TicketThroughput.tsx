import React, { useEffect, useState } from 'react';
import { Form, FormItem, useForm } from '@/templates/components/Form';
import { Button, Col, Row, Table } from 'antd';
import { getTicketThroughput } from '@/services/jira.service';
import useService from '@/templates/hooks/useService';
import DatePickerString from '@/templates/components/Form/FormItems/DatePickerString';
import { stringParamReqToDate, dateToStringParamReq } from '@/templates/utils/format.util';
import { SelectRequestType } from './SelectRequestType';
import { AverageTimeBarChart } from './AverageTimeBarChart';
import RangePickerString from '@/templates/components/Form/FormItems/RangePickerString';

const toOptionalFixed = (num: number, digits: number) =>
  `${Number.parseFloat(num.toFixed(digits))}`;

const CustomTooltip = ({ active, payload }: any) => {
  if (!active) {
    return null;
  }
  if (!payload || !payload[0]) {
    return null;
  }
  const data = payload[0].payload;
  return (
    <div style={{ background: '#fff', padding: 5 }}>
      <div>
        <strong>{data.displayName}</strong>
      </div>
      <div>
        <span>Scale:</span> <span>{data.scale}</span>
      </div>
      <div>
        <span>Daily Average:</span> <span>{toOptionalFixed(data.averageIssues, 2)}</span>
      </div>
      <div>
        <span>Total Complete Issues:</span>{' '}
        <span>{toOptionalFixed(data.totalCompleteIssues, 2)}</span>
      </div>
      <div>
        <span>Count of days under ticket threshold:</span>{' '}
        <span>{toOptionalFixed(data.countOfDaysUnderThreshold, 2)}</span>
      </div>
      <div>
        <span>Average Open:</span> <span>{toOptionalFixed(data.totalOpenIssues, 2)}</span>
      </div>
      <div>
        <span>Average Closed:</span> <span>{toOptionalFixed(data.totalCompleteIssues, 2)}</span>
      </div>
    </div>
  );
};

export const TicketThroughput = () => {
  const [form] = useForm();
  const [formValues, setFormValues] = useState<any>({});
  const useGetTicketThroughput = useService(getTicketThroughput);

  useEffect(() => {
    if (!formValues.dateRange) {
      return;
    }
    // @ts-ignore
    const { startDate, endDate } = (() => {
      if (!formValues.dateRange) {
        return {};
      }
      const startDate = formValues.dateRange[0];
      const endDate = dateToStringParamReq(
        stringParamReqToDate(formValues.dateRange[1])?.add(1, 'days')
      );
      return { startDate, endDate };
    })();
    useGetTicketThroughput.execute({
      startDate,
      endDate,
      requestTypeName: formValues.requestTypeName,
    });
  }, [formValues]);

  return (
    <>
      <Form
        form={form}
        onFieldsChange={async (_, allFields) => {
          setFormValues(form.getFieldsValue());
        }}
        layout="inline"
        initialValues={{ requestTypeName: '' }}
      >
        <FormItem label="Ticket created date" name="dateRange">
          <RangePickerString />
        </FormItem>
        <FormItem style={{ minWidth: 400 }} label="Request type" name="requestTypeName">
          <SelectRequestType form={form} />
        </FormItem>
      </Form>
      <Row>
        <Col sm={{ span: 24 }}>
          <Table
            style={{ marginBottom: 20 }}
            columns={[
              {
                title: 'Agent',
                dataIndex: 'displayName',
              },
              {
                title: 'Scale',
                dataIndex: 'scale',
              },
              {
                title: 'Daily Average',
                dataIndex: 'averageIssues',
                render(value, record, index) {
                  return toOptionalFixed(value, 2);
                },
              },
              {
                title: 'Total Complete',
                dataIndex: 'totalCompleteIssues',
                render(value, record, index) {
                  return (
                    <div style={{width: 130}}>
                      <span style={{lineHeight: '32px'}}>{toOptionalFixed(value, 2)}</span>
                      <Button style={{float: 'right'}} target='_blank' href={record.jiraCompleteLink} type="link">JQL filter </Button>
                    </div>
                  );
                },
              },
            ]}
            dataSource={useGetTicketThroughput.value as any}
            pagination={false}
            loading={useGetTicketThroughput.loading}
          ></Table>
        </Col>
        <Col sm={{ span: 24, offset: 0 }} md={{ span: 18, offset: 2 }} lg={{ span: 12, offset: 6 }}>
          <AverageTimeBarChart
            title="Ticket throughput by person"
            useServiceData={useGetTicketThroughput}
            barDataKey="scale"
            onClick={(item: any) => {
              if (item.jiraLink && item.jiraLink !== '') {
                window.open(item.jiraLink, '_blank', 'noreferrer');
              }
            }}
            TooltipContent={CustomTooltip}
          />
        </Col>
      </Row>
    </>
  );
};
