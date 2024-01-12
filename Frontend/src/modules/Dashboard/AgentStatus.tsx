import { getAgents, updateAgents } from '@/services/jira.service';
import { Form, FormItem, useForm } from '@/templates/components/Form';
import { Button, Checkbox } from 'antd';
import DatePickerString from '@/templates/components/Form/FormItems/DatePickerString';
import Select from '@/templates/components/Form/FormItems/Select';
import useService from '@/templates/hooks/useService';
import React, { useEffect, useState } from 'react';
import CommonInput from '@/templates/components/Form/FormItems/Input';
import Spin from '@/templates/components/Spin';

const getAgentIdFromFieldName = (fieldName: string): string => {
  return fieldName.split('.')[0];
};

export const AgentStatus = () => {
  const useGetAgents = useService(getAgents);
  const useUpdateAgents = useService(updateAgents);
  const [projectPercentages, setProjectPercentages] = useState<any>({});
  const [form] = useForm();

  useEffect(() => {
    useGetAgents.execute();
  }, []);

  const handleSubmit = async (values: any) => {
    const agents: any = {};
    Object.keys(values).forEach((key) => {
      const agentId = key.split('.')[0];
      const keyField = key.split('.')[1];
      if (!agents[agentId]) {
        agents[agentId] = {
          agentId,
        };
      }
      agents[agentId][keyField] = values[key];
    });
    const [error, res] = await useUpdateAgents.execute(Object.values(agents));
    if (res) {
      const updatedProjectPercentages = res.data.reduce((obj: any, item: any) => {
        obj[item.agentId] = item.projectPercentage;
        return obj;
      }, {});
      setProjectPercentages({ ...projectPercentages, ...updatedProjectPercentages });
    }
  };

  useEffect(() => {
    const initValues = ((useGetAgents?.value as any) || []).reduce((obj: any, item: any) => {
      return {
        ...obj,
        [`${item.agentId}.agentName`]: item.agentName,
        [`${item.agentId}.supportPercentage`]: item.supportPercentage,
        [`${item.agentId}.projectPercentage`]: item.projectPercentage,
        [`${item.agentId}.projectEndDate`]: item.projectEndDate,
        [`${item.agentId}.defaultToSupport`]: !!item.defaultToSupport,
        [`${item.agentId}.includeInReport`]: !!item.includeInReport,
      };
    }, {});
    form.setFieldsValue(initValues);
  }, [useGetAgents.value]);
  return (
    <div>
      <div>
        <Spin spinning={useGetAgents.loading}>
          <Form
            form={form}
            onFieldsChange={async (changedFields, allFields) => {
              const changedAgentIds = changedFields
                .flatMap((item) => item.name)
                .map((item) => getAgentIdFromFieldName(item as string));
              if (changedAgentIds.length == 0) {
                return;
              }
              const allValues = form.getFieldsValue();
              const changedAgents = Object.keys(allValues).reduce(
                (changeValue: any, fieldName: string) => {
                  const agentId = getAgentIdFromFieldName(fieldName);
                  if (changedAgentIds.includes(agentId)) {
                    changeValue[fieldName] = allValues[fieldName];
                  }
                  return changeValue;
                },
                {}
              );
              await handleSubmit(changedAgents);
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridColumnGap: 10,
                padding: 6,
                marginBottom: 10,
              }}
            >
              <div>Name</div>
              <div>
                <strong style={{ paddingLeft: 10 }}>Support %</strong>
              </div>
              <div>
                <strong style={{ paddingLeft: 10 }}>Project %</strong>
              </div>
              <div>Project End Date</div>
              <div>Default to Support</div>
              <div>Include In Reporting</div>
            </div>
            {((useGetAgents?.value as any) || []).map((item: any) => {
              return (
                <div
                  key={item.agentId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridColumnGap: 10,
                    padding: 6,
                    marginBottom: 10,
                    border: '1px solid #E0E0E0',
                  }}
                >
                  <div>
                    <FormItem label="" name={`${item.agentId}.agentName`}>
                      {item.agentName}
                      <CommonInput style={{ display: 'none' }} />
                    </FormItem>
                  </div>
                  <div>
                    <FormItem label="" name={`${item.agentId}.supportPercentage`}>
                      <Select data={[0, 25, 50, 75, 100]} />
                    </FormItem>
                  </div>
                  <div>
                    <FormItem label="" name={`${item.agentId}.projectPercentage`}>
                      {projectPercentages[item.agentId] !== undefined
                        ? projectPercentages[item.agentId]
                        : item.projectPercentage}
                    </FormItem>
                  </div>
                  <div>
                    <FormItem label="" name={`${item.agentId}.projectEndDate`}>
                      <DatePickerString style={{ minWidth: 95 }} />
                    </FormItem>
                  </div>
                  <div>
                    <FormItem
                      label=""
                      name={`${item.agentId}.defaultToSupport`}
                      valuePropName="checked"
                    >
                      <Checkbox value="true">Default To Support</Checkbox>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem
                      label=""
                      name={`${item.agentId}.includeInReport`}
                      valuePropName="checked"
                    >
                      <Checkbox value="true">Include In Report</Checkbox>
                    </FormItem>
                  </div>
                </div>
              );
            })}
            {/* <div style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={handleSubmit}>
                Save
              </Button>
            </div> */}
          </Form>
        </Spin>
      </div>
    </div>
  );
};
