import { ChartBox } from '../ChartBox';

export type CountCard = ChartBox & {
  type: 'CountCard';
}

export const CountCard = (props: CountCard) => {
  const value = props.data?.[0] ? Object.values(props.data[0])[0] : '';
  return (
    <ChartBox {...props} className='border-t-[6px] border-t-indigo-500'>
      <div className='mt-2 ml-2 font-bold text-3xl overflow-auto'>{renderValue(value)}</div>
    </ChartBox>
  );
};

function renderValue(v: any) {
  if (typeof v == 'string' || typeof v == 'number') {
    return v;
  }
  return JSON.stringify(v);
}