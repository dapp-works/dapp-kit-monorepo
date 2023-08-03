import { cn } from '@/dappkit/lib/utils';
import { WidgetProps } from '@rjsf/utils';

type Options = {
  className?: string;
  selectOptions: { icon: JSX.Element; label: string; value: string; }[];
};

export interface IconSelectWidgetProps extends WidgetProps {
  options: Options;
}

export interface IconSelectWidgetUIOptions {
  'ui:widget': (props: IconSelectWidgetProps) => JSX.Element;
  'ui:options': Options;
}

function IconSelectWidget({ onChange, options, value }: IconSelectWidgetProps) {
  const { className, selectOptions = [] } = options;
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {selectOptions.map((item) => (
        <div
          key={item.value}
          className={cn("flex flex-col items-center space-x-2 cursor-pointer drop-shadow-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md", {
            'bg-gray-200 dark:bg-gray-700': value === item.value,
          })}
          onClick={() => onChange(item.value)}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default IconSelectWidget;
