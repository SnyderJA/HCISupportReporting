import React, { useEffect, useState } from 'react';
import { Form, FormItem, useForm } from '@/templates/components/Form';
import RangePickerString from '@/templates/components/Form/FormItems/RangePickerString';
import { Col, Modal, Row } from 'antd';
import SelectAjax from '@/templates/components/Form/FormItems/SelectAjax';
import {
  getAverageTimeToResolution,
  getAverageTimeToFirstResponse,
  getCountTimeToResolution,
  getCountTimeToFirstResponse,
  getAverageTimeToFirstResponseByDate,
  getAverageTimeToResolutionByDate,
  getCountTimeToFirstResponseByDate,
  getCountTimeToResolutionByDate,
} from '@/services/jira.service';

import useService from '@/templates/hooks/useService';
import { stringParamReqToDate, dateToStringParamReq } from '@/templates/utils/format.util';
import { SelectRequestType } from './SelectRequestType';
import { AverageTimeBarChart } from './AverageTimeBarChart';
import { AverageTimeBarChartByDate } from './AverageTimeBarChartByDate';
import { CountTimeLineChart } from './CountTimeLineChart';
import { CountTimeLineChartByDate } from './CountTimeLineChartByDate';

const convertAverageValues = (values = []) => {
  if (!values) {
    return [];
  }
  return values.map((item: any) => {
    return {
      ...item,
      average: Math.floor(item.average / 60000),
    };
  });
};

const convertAverageValuesByDates = (values = [], startDate: any, endDate: any) => {
  if (!values) {
    return [];
  }
  const objectMap = values.reduce((obj: any, item: any) => {
    obj[item.date] = {
      ...item,
      average: Math.floor(item.average / 60000),
    };
    return obj;
  }, {});
  const frequency = [];
  for (
    var m = stringParamReqToDate(startDate);
    m?.isBefore(stringParamReqToDate(endDate));
    m.add(1, 'day')
  ) {
    const date = m.format('YYYY-MM-DD');
    if (objectMap[date]) {
      frequency.push(objectMap[date]);
    } else {
      frequency.push({
        date,
        average: 0,
      });
    }
  }
  return frequency;
};

export const SLAMetrics = () => {
  const [form] = useForm();
  const [formValues, setFormValues] = useState<any>({});
  const useGetAverageTimeToFirstResponse = useService(getAverageTimeToFirstResponse);
  const useGetAverageTimeToResolution = useService(getAverageTimeToResolution);
  const useGetCountTimeToFirstResponse = useService(getCountTimeToFirstResponse);
  const useGetCountTimeToResolution = useService(getCountTimeToResolution);
  const useGetAverageTimeToFirstResponseByDate = useService(getAverageTimeToFirstResponseByDate);
  const useGetAverageTimeToResolutionByDate = useService(getAverageTimeToResolutionByDate);
  const useGetCountTimeToFirstResponseByDate = useService(getCountTimeToFirstResponseByDate);
  const useGetCountTimeToResolutionByDate = useService(getCountTimeToResolutionByDate);

  const [modalGetAverageTimeToFirstResponseByDate, setModalGetAverageTimeToFirstResponseByDate] =
    useState<any>(false);
  const [modalGetAverageTimeToResolutionByDate, setModalGetAverageTimeToResolutionByDate] =
    useState<any>(false);
  const [modalGetCountTimeToFirstResponseByDate, setModalGetCountTimeToFirstResponseByDate] =
    useState<any>(false);
  const [modalGetCountTimeToResolutionByDate, setModalGetCountTimeToResolutionByDate] =
    useState<any>(false);
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

  useEffect(() => {
    if (!startDate) {
      return;
    }
    useGetAverageTimeToFirstResponse.execute({
      startDate: formValues.dateRange[0],
      endDate,
      requestTypeName: formValues.requestTypeName,
    });
    useGetAverageTimeToResolution.execute({
      startDate: formValues.dateRange[0],
      endDate,
      requestTypeName: formValues.requestTypeName,
    });
    useGetCountTimeToFirstResponse.execute({
      startDate: formValues.dateRange[0],
      endDate,
      requestTypeName: formValues.requestTypeName,
    });
    useGetCountTimeToResolution.execute({
      startDate: formValues.dateRange[0],
      endDate,
      requestTypeName: formValues.requestTypeName,
    });
  }, [formValues]);

  useEffect(() => {
    if (!modalGetAverageTimeToFirstResponseByDate) {
      return;
    }
    useGetAverageTimeToFirstResponseByDate.execute({
      startDate,
      endDate,
      requestTypeName: formValues.requestTypeName,
      accountId: modalGetAverageTimeToFirstResponseByDate.accountId,
    });
  }, [modalGetAverageTimeToFirstResponseByDate]);

  useEffect(() => {
    if (!modalGetAverageTimeToResolutionByDate) {
      return;
    }
    useGetAverageTimeToResolutionByDate.execute({
      startDate,
      endDate,
      requestTypeName: formValues.requestTypeName,
      accountId: modalGetAverageTimeToResolutionByDate.accountId,
    });
  }, [modalGetAverageTimeToResolutionByDate]);

  useEffect(() => {
    if (!modalGetCountTimeToFirstResponseByDate) {
      return;
    }
    useGetCountTimeToFirstResponseByDate.execute({
      startDate,
      endDate,
      requestTypeName: formValues.requestTypeName,
      accountId: modalGetCountTimeToFirstResponseByDate.accountId,
    });
  }, [modalGetCountTimeToFirstResponseByDate]);

  useEffect(() => {
    if (!modalGetCountTimeToResolutionByDate) {
      return;
    }
    useGetCountTimeToResolutionByDate.execute({
      startDate,
      endDate,
      requestTypeName: formValues.requestTypeName,
      accountId: modalGetCountTimeToResolutionByDate.accountId,
    });
  }, [modalGetCountTimeToResolutionByDate]);

  return (
    <>
      <Form
        colon
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
        <Col sm={24} md={24} lg={12} xl={12}>
          <AverageTimeBarChart
            title="Average first response time by person"
            useServiceData={useGetAverageTimeToFirstResponse}
            barDataKey="average"
            yAxisLabel={{ value: 'minutes', position: 'insideLeft', angle: -90, dy: -10 }}
            barUnit=" minutes"
            convertValues={convertAverageValues}
            onClick={(item: any) => {
              if (item.jiraLink && item.jiraLink !== '') {
                window.open(item.jiraLink, '_blank', 'noreferrer');
              } else {
                setModalGetAverageTimeToFirstResponseByDate(item);
              }
            }}
          />
          <Modal
            width={'100%'}
            onCancel={() => {
              setModalGetAverageTimeToFirstResponseByDate(false);
            }}
            visible={modalGetAverageTimeToFirstResponseByDate}
            footer={null}
          >
            <AverageTimeBarChartByDate
              title={`Average first response time: ${modalGetAverageTimeToFirstResponseByDate.displayName}`}
              useServiceData={useGetAverageTimeToFirstResponseByDate}
              barDataKey="average"
              yAxisLabel={{ value: 'minutes', position: 'insideLeft', angle: -90, dy: -10 }}
              barUnit=" minutes"
              convertValues={(values = []) => {
                return convertAverageValuesByDates(values, startDate, endDate);
              }}
            />
          </Modal>
        </Col>
        <Col sm={24} md={24} lg={12} xl={12}>
          <AverageTimeBarChart
            title="Average time to resolution by person"
            useServiceData={useGetAverageTimeToResolution}
            barDataKey="average"
            yAxisLabel={{ value: 'minutes', position: 'insideLeft', angle: -90, dy: -10 }}
            barUnit=" minutes"
            convertValues={convertAverageValues}
            onClick={(item: any) => {
              setModalGetAverageTimeToResolutionByDate(item);
            }}
          />
          <Modal
            width={'100%'}
            onCancel={() => {
              setModalGetAverageTimeToResolutionByDate(false);
            }}
            visible={modalGetAverageTimeToResolutionByDate}
            footer={null}
          >
            <AverageTimeBarChartByDate
              title={`Average time to resolution: ${modalGetAverageTimeToResolutionByDate.displayName}`}
              useServiceData={useGetAverageTimeToResolutionByDate}
              barDataKey="average"
              yAxisLabel={{ value: 'minutes', position: 'insideLeft', angle: -90, dy: -10 }}
              barUnit=" minutes"
              convertValues={(values = []) => {
                return convertAverageValuesByDates(values, startDate, endDate);
              }}
            />
          </Modal>
        </Col>
        <Col sm={24} md={24} lg={12} xl={12}>
          <CountTimeLineChart
            title="Count of SLA breaches and SLA achieved by person for first response"
            useServiceData={useGetCountTimeToFirstResponse}
            onClick={(item: any) => {
              setModalGetCountTimeToFirstResponseByDate(item);
            }}
          />
          <Modal
            width={'100%'}
            onCancel={() => {
              setModalGetCountTimeToFirstResponseByDate(false);
            }}
            visible={modalGetCountTimeToFirstResponseByDate}
            footer={null}
          >
            <CountTimeLineChartByDate
              title={`Count of SLA breaches and SLA achieved by person for first response: ${modalGetCountTimeToFirstResponseByDate.displayName}`}
              useServiceData={useGetCountTimeToFirstResponseByDate}
              startDate={startDate}
              endDate={endDate}
            />
          </Modal>
        </Col>
        <Col sm={24} md={24} lg={12} xl={12}>
          <CountTimeLineChart
            title="Count of SLA breaches and SLA achieved by person for resolution"
            useServiceData={useGetCountTimeToResolution}
            onClick={(item: any) => {
              setModalGetCountTimeToResolutionByDate(item);
            }}
          />
          <Modal
            width={'100%'}
            onCancel={() => {
              setModalGetCountTimeToResolutionByDate(false);
            }}
            visible={modalGetCountTimeToResolutionByDate}
            footer={null}
          >
            <CountTimeLineChartByDate
              title={`Count of SLA breaches and SLA achieved by person for resolution: ${modalGetCountTimeToResolutionByDate.displayName}`}
              useServiceData={useGetCountTimeToResolutionByDate}
              startDate={startDate}
              endDate={endDate}
            />
          </Modal>
        </Col>
      </Row>
    </>
  );
};
