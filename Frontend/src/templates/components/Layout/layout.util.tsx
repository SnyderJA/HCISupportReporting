import crud from '@/configs/templates/crud';

export const crudMenus = crud.map((item: any) => {
  return {
    name: item.title,
    icon: item.menuicon,
    path: `/crud/${item.path}`,
  };
});
