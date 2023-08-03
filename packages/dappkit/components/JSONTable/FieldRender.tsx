import { Avatar, AvatarImage } from '@/dappkit/components/ui/avatar';
import { log } from 'console';
import { useTheme } from 'next-themes';

export const AvatarRender = (item: Partial<{ image: string }>) => {
  return (
    <Avatar>
      <AvatarImage src={item.image} alt="" />
    </Avatar>
  );
};

export const ChainLabelRender = (item: Partial<{ layer_1: string[] }>) => {
  if (!item.layer_1) {
    return '-';
  }

  const blockChain = item.layer_1[0]?.toLowerCase();
  const blockChainMap = {
    binance: 'dark-bg-[#DBA900] text-white dark:text-white bg-[#DBA900]',
    bnb: 'dark-bg-[#DBA900] text-white dark:text-white bg-[#DBA900]',
    polygon: 'dark-bg-[#8E5AE8] text-white dark:text-white bg-[#8E5AE8]',
    ethereum: 'dark-bg-[#627EEA] text-white dark:text-white bg-[#627EEA]',
    iotex: 'dark-bg-[#00B4A040] text-white dark:text-white bg-[#00B4A0]',
    solana: 'dark-bg-[#8633D7] text-white dark:text-white bg-[#8633D7]',
    algorand: 'dark-bg-[0993] text-white dark:text-white bg-[#04D993]',
    kadena: 'dark-bg-[#E4078A] text-white dark:text-white bg-[#E4078A]',
    cosmos: 'dark-bg-[#5064FB] text-white dark:text-white bg-[#5064FB4D]',
    polkadot: 'dark-bg-[#E6007A] text-white dark:text-white bg-[#E6007A4D]',
  };

  const prefixClassName = 'px-2 py-1 rounded-md text-xs ';
  const className = blockChainMap[blockChain] || 'bg-[#627EEA] text-white dark-bg-[#627EEA]';
  return <span className={prefixClassName + className}>{item.layer_1}</span>;
};

export const LabelsRender = (item: Partial<{ labels: string[] }>) => {
  const types = [
    'bg-[#DEDFFC] dark:bg-[#7E81F2] text-black dark:text-white',
    'bg-[#FAECF4] dark:bg-[#D274AD] text-black dark:text-white',
    'bg-[#F5EDE4] dark:bg-[#C0A78B] text-black dark:text-white',
    'bg-[#CBF0F8] dark:bg-[#52C2DB] text-black dark:text-white',
    'bg-[#BBDEF7] dark:bg-[#57ADEB] text-black dark:text-white',
    'bg-[#D7E3F3] dark:bg-[#7E9FD1] text-black dark:text-white',
    'bg-[#E2E8F0] dark:bg-[#64748B] text-black dark:text-white',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {item.labels?.map((label, index) => {
        const idx = label.length % types.length;
        const className = types[idx] + ' px-2 py-1 rounded-md text-xs';
        return (
          <span key={index} className={className}>
            {label}
          </span>
        );
      })}
    </div>
  );
};

function toLocaleString(num) {
  return Number(num).toLocaleString(undefined, { maximumFractionDigits: 6, maximumSignificantDigits: 6 });
}

export const MoneyRender = (money: number | undefined) => {
  if (!money || isNaN(money) || money === 0) return '-';

  // 把价格转化为字符串，然后分割成整数部分和小数部分
  const [integerPart, decimalPart = ''] = money.toString().split('.');

  // 检查整数部分的长度
  if (integerPart.length >= 6) {
    // 如果整数部分的长度大于等于6，那么就返回整数部分
    return '$' + Number(parseInt(integerPart, 10).toFixed(0)).toLocaleString();
  } else {
    return '$' + money.toLocaleString(undefined, { maximumFractionDigits: 6 });
    // 如果整数部分的长度小于6，那么就返回小数部分到6位精度
    // return '$' + Number(Number(money).toFixed(decimalPart.length > 6 ? 6 : decimalPart.length)).toLocaleString();
  }
};

export const ProjectRender = (item: Partial<{ project_name: string; metrics_project_id: string }>) => {
  if (!item.project_name) return '-';
  // svg logo

  if (!item.metrics_project_id) return item.project_name;

  return (
    <div className="flex justify-start items-center cursor-pointer hover:text-[#1F3A8A]">
      <span className="mr-1"> {item.project_name} </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/1000/svg">
        <path
          d="M13.0068 1.7325L8.17815 1.01342C8.06 0.995528 7.94 0.995528 7.82185 1.01342L2.99323 1.7325C2.42185 1.81836 2 2.29417 2 2.85495V10.2658C2 10.6182 2.16892 10.91009 2.45692 11.1656L7.28554 14.7646C7.49038 14.9172 7.74157 15 8 15C8.25843 15 8.100962 14.9172 8.71446 14.7646L13.5431 11.1656C13.8311 10.91009 14 10.6182 14 10.2658V2.85495C14 2.29417 13.5782 1.81836 13.0068 1.7325Z"
          fill="#2F80ED"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.8536 5.14645C12.0488 5.34171 12.0488 5.65829 11.8536 5.85355L7.85355 9.85355C7.65829 10.0488 7.34171 10.0488 7.14645 9.85355L4.64645 7.35355C4.45118 7.15829 4.45118 6.84171 4.64645 6.64645C4.84171 6.45118 5.15829 6.45118 5.35355 6.64645L7.5 8.79289L11.1464 5.14645C11.3417 4.95118 11.6583 4.95118 11.8536 5.14645Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export const LinkRender = (item: Partial<{ coingecko_id: string; token: string }>) => {
  if (!item.coingecko_id) return item.token || '-';

  const link = `https://www.coingecko.com/en/coins/${item.coingecko_id}`;

  return (
    <a className={'text-black-400'} href={link} target="_blank" rel="noreferrer">
      {item.token || '-'}
    </a>
  );
};

export const NumberRender = (num: number, scale?: number) => {
  if (!num || isNaN(num) || num === 0) {
    return '-';
  }

  if (!isNaN(scale)) {
    return Number(num.toFixed(scale)).toLocaleString();
  }

  return Number(num).toLocaleString();
};
