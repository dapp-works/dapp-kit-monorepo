import { JSONComponent } from '@dappworks/kit/jsoncomponent';
import ThemeSwitcher from '~/components/ThemeSwitcher';

const JSONComp = () => {
  const jsondata1 = [
    {
      title: "title 1",
      desc: "desc 1"
    },
    {
      title: "title 2",
      desc: "desc 2"
    }
  ];
  const jsondata2 = [1, 2, 3]
  const jsondata3 = {
    title: "title",
    desc: "desc"
  }

  return (
    <div className="mt-4 p-4 w-full lg:w-[900px] mx-auto border">
      <ThemeSwitcher />
      <JSONComponent className='mt-8' jsondata={jsondata1} />
    </div>
  )
}

export default JSONComp;