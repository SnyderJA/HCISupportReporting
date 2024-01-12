import { getRequestTypes } from '@/services/jira.service';
import SelectAjax from '@/templates/components/Form/FormItems/SelectAjax';

const handleGetDataResponseServiceTypeOptions = (result: any) => {
  const [err, res] = result;
  if (err) {
    return [];
  }
  return res.data.map((item: any) => ({ label: item.name, id: item.name }));
};

export const SelectRequestType = ({ form, ...props }: any) => {
  return (
    <SelectAjax
      {...props}
      placeholder="All"
      mode="multiple"
      formFieldName="requestTypeName"
      typeValue="string"
      form={form}
      service={getRequestTypes}
      handleGetDataResponse={handleGetDataResponseServiceTypeOptions}
    />
  );
};
