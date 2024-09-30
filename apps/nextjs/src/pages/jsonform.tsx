import { Button } from "@nextui-org/react";
import { ComplexFormModalStore, DatePickerWidget, EditorWidget, getComplexFormData } from "@dappworks/kit/form";
import { RootStore } from "@dappworks/kit";
import ThemeSwitcher from "~/components/ThemeSwitcher";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useState } from "react";

const JSONForm = dynamic(() => import('@dappworks/kit/form').then((mod) => mod.JSONForm), { ssr: false });

const HomePage = observer(() => {
  const formData = {
    personalInfo: {
      name: '',
      age: 18,
      phone: '',
      city: 'city1',
      date: '2021-01-01',
      dateTime: '2021-01-01T00:00:00',
      boolean: true,
      boolean2: false,
      object: {
        a: 1,
        b: 2,
      },
    },
    extraInfo: {
      address: '',
      code: '',
      jsonStr: '{"personalInfo":{"name":"","age":18,"phone":"","city":"city1","date":"2021-01-01","dateTime":"2021-01-01T00:00:00","time":"00:00:00","boolean":true},"extraInfo":{"address":"","code":""}}'
    },
  };

  const formConfig = {
    personalInfo: {
      name: {
        title: 'Name',
        required: true,
      },
      age: {
        required: true,
        validate: (v) => {
          if (v < 18) {
            return 'Age must be greater than 18';
          }
        },
        'ui:options': {
          placeholder: 'Please input age',
        },
      },
      phone: {
        required: true,
        // 'ui:options': {
        //   disabled: true,
        // },
      },
      city: {
        // Optional field
        selectOptions: [
          { label: 'city 1', value: 'city1' },
          { label: 'city 2', value: 'city2' },
          { label: 'city 3', value: 'city3' },
        ],
        // isMultipleSelect: true,
        required: true,
        validate: (v) => {
          if (v === 'city1') {
            return 'City cannot be city1';
          }
        },
        'ui:options': {
          placeholder: 'Select a city',
          description: 'This is a description',
          // renderValue: (items) => {
          //   const textList = items.map((item) => item.textValue);
          //   return textList.join(', ');
          // }
          // disabled: true,
        },
      },
      date: {
        title: 'Date',
        'ui:widget': DatePickerWidget,
        'ui:options': {
          granularity: 'day'
        }
      },
      dateTime: {
        title: 'Date Time',
        'ui:widget': DatePickerWidget,
        'ui:options': {
          granularity: 'minute'
        }
      },
      // boolean: {
      //   title: 'Boolean',
      //   'ui:options': {
      //     // disabled: true,
      //     nextuiClassNames: {
      //       base: 'py-1 px-2'
      //     }
      //   }
      // },
      // boolean2: {
      //   // description: 'This is a description',
      //   'ui:options': {
      //     color: 'secondary'
      //   }
      // }
    },
    extraInfo: {
      code: {
        required: true,
        'ui:widget': EditorWidget,
        'ui:options': {
          language: 'javascript',
          editorHeight: '240px',
        },
      },
    },
  };

  return (
    <div className="mt-4 p-4 w-full lg:w-[900px] mx-auto border">
      <ThemeSwitcher />
      <JSONForm
        className="mt-10"
        theme="primary"
        formData={formData}
        formConfig={formConfig}
        layoutConfig={{
          $type: 'GridLayout',
          $gridColumn: 2,
          personalInfo: {
            title: 'Personal Information',
            titleBoxCss: 'text-xl',
            fieldLayout: [['name', 'age'], 'phone', 'city', 'date', 'dateTime', 'boolean', 'object'],
            // submitButtonProps: {
            //   className: 'mx-auto',
            //   color: 'secondary',
            //   size: 'md',
            //   children: (
            //     <div className="flex items-center">
            //       <Send />
            //       <span className="ml-2">Customized submit button</span>
            //     </div>
            //   ),
            //   onAfterSubmit: async (formKey, formData, setLoading) => {
            //     console.log('[GridLayout onSubmit]', formKey, formData);
            //     setLoading(true);
            //     await new Promise((resolve) => setTimeout(resolve, 2000));
            //     setLoading(false);
            //   },

            customRender: {
              Top: (formKey, formState) => {
                console.log('[GridLayout Top]===>', formKey, formState);
                return (
                  <div className="mb-2 flex items-center gap-2">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => {
                        console.log('Top Button Click');
                      }}
                    >
                      Top Button
                    </Button>
                  </div>
                )
              },
              SubmitButtonAfter(formKey, formState) {
                console.log('[GridLayout SubmitButtonAfter]===>', formKey, formState);
                const CustomButton = ({ className, children, onClick, ...rest }) => {
                  const [loading, setLoading] = useState(false);
                  return (
                    <Button
                      className={className}
                      type="submit"
                      color="primary"
                      size="sm"
                      isLoading={loading}
                      onClick={() => {
                        const formData = formState.formRef.current?.state.formData;
                        onClick?.(formKey, formData, setLoading);
                      }}
                      {...rest}
                    >
                      {children}
                    </Button>
                  )
                }

                const buttonPropsList = [
                  {
                    className: '',
                    children: 'test1',
                    onClick: async (formKey, formData, setLoading) => {
                      console.log('click test1:', formKey, formData);
                      setLoading(true);
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      setLoading(false);
                    }
                  },
                  {
                    className: '',
                    children: 'test2',
                    onClick: (formKey, formData, setLoading) => { console.log('click test2') }
                  }
                ]

                return (
                  <div className="mt-2 flex items-center gap-2">
                    {buttonPropsList.map((item, index) => {
                      return <CustomButton key={index} className={item.className} onClick={item.onClick}>{item.children}</CustomButton>
                    })}
                  </div>
                )
              }
            },

          },
          extraInfo: {
            title: 'Extra Information',
            // colSpan: 2,
            // submitButtonProps: {
            //   onAfterSubmit: async (formKey, formData, setLoading) => {
            //     console.log('[GridLayout onSubmit]', formKey, formData);
            //     setLoading(true);
            //     await new Promise((resolve) => setTimeout(resolve, 2000));
            //     setLoading(false);
            //   },
            // },
          },

          // $combFormsCustomRender: {
          //   Top: (formStates) => {
          //     return 'Top';
          //   },
          //   SubmitButtonBefore: (formStates) => {
          //     return 'SubmitButtonBefore';
          //   },
          //   SubmitButtonAfter: (formStates) => {
          //     return 'SubmitButtonAfter';
          //   },
          // }

        }}
        batchSubmitButtonProps={{
          className: 'mx-auto',
          color: 'secondary',
          size: 'md',
          children: (
            <div className="flex items-center">
              <span className="ml-2">Customized submit button</span>
            </div>
          ),
        }}
        onBatchSubmit={async (formData, setLoading) => {
          console.log('[GridLayout onBatchSubmit]', formData);
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setLoading(false);
        }}
        onSet={(v, form) => {
          console.log('[GridLayout onSet]', v, form);
          // @ts-ignore
          if (v.name && v.name !== form.formData.name) {
            // @ts-ignore
            v.phone = v.name;
          }
          return v;
        }}
        onChange={(data) => {
          console.log('[GridLayout onChange]', data);
        }}
      />


      <div className="flex items-center gap-2">
        <Button
          className="my-10"
          color="primary"
          onClick={async () => {
            const data = await getComplexFormData({
              title: 'Complex Form',
              // className: 'w-[100%] md:w-[80%] lg:w-[60%]',
              theme: 'primary',
              // classNames: {
              //   body: "bg-red-500"
              // },
              modalSize: '5xl',
              formData,
              // @ts-ignore
              formConfig,
              layoutConfig: {
                $type: 'GridLayout',
                $gridColumn: 2,
                personalInfo: {
                  title: 'Personal Information',
                  fieldLayout: [['name', 'age'], 'phone', 'city'],
                },
                extraInfo: {
                  title: 'Extra Information',
                },
              },
              onBatchSubmit: async (data, setLoading) => {
                console.log('[getComplexFormData onBatchSubmit]:', data);
                setLoading?.(true);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setLoading?.(false);
                RootStore.Get(ComplexFormModalStore).close();
              },
              // onChange: (data) => {
              //   console.log('[getComplexFormData onChange]:', data);
              // }
            });
            console.log('[getComplexFormData]:', data);
          }}
        >
          Get Complex Form Data
        </Button>
      </div>
    </div>
  );
})

export default HomePage;