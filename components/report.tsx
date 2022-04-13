import React, { useCallback, useState } from 'react';
import { Button, Form, Input, message, Select, Space, TimePicker, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { CANTEENS } from '../config';

type Image = UploadFile<null>;

interface DishReportFormValue extends Omit<Dish, 'img'> {
  img: {
    file: File;
  };
  ranges: any[];
}

export const DishReportForm: React.FC = () => {
  const [form] = Form.useForm<DishReportFormValue>();
  const [submitting, setSubmitting] = useState(false);
  const [_, setDep] = useState(0);
  const forceUpdate = useCallback(() => setDep(i => i + 1), []);
  const [fileList, setFileList] = useState<Image[]>([]);

  const onFinish = useCallback(
    async (values: DishReportFormValue) => {
      setSubmitting(true);
      const ranges = values.ranges.map((range: any, index) => ({
        start: range[index][0].hour() * 60 + range[index][0].minute(),
        end: range[index][1].hour() * 60 + range[index][1].minute(),
      }));
      const formdata = new FormData();
      formdata.append('name', values.name);
      formdata.append('img', values.img.file);
      formdata.append('canteen', values.canteen);
      formdata.append('floor', values.floor ?? '');
      formdata.append('window', values.window ?? '');
      formdata.append('ranges', JSON.stringify(ranges));
      formdata.append('price', String(values.price));
      formdata.append('remark', values.remark ?? '');
      formdata.append('reporter', values.reporter ?? '');
      const response = await (
        await fetch('/api/report', { method: 'POST', body: formdata })
      ).json();
      if (response.code === 0) {
        message.success('提交成功');
        form.resetFields();
      } else {
        message.error('提交失败');
      }
      setSubmitting(false);
    },
    [form]
  );

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>提交新菜</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请填写名称',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="图片"
          name="img"
          rules={[
            {
              required: true,
              message: '请上传图片',
            },
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
            multiple={false}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            showUploadList={{
              showPreviewIcon: false,
            }}
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="食堂"
          name="canteen"
          rules={[
            {
              required: true,
              message: '请选择食堂',
            },
          ]}
        >
          <Select
            onChange={canteen => {
              form.setFieldsValue({ canteen, floor: undefined, window: undefined });
              forceUpdate();
            }}
          >
            {CANTEENS.map(canteen => (
              <Select.Option key={canteen.canteen} value={canteen.canteen}>
                {canteen.canteen}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {(() => {
          const canteen = CANTEENS.find(
            canteen => canteen.canteen === form.getFieldValue('canteen')
          );
          return (
            canteen && canteen.floors && (
              <Form.Item label="楼层">
                <Select
                  onChange={floor => {
                    form.setFieldsValue({ floor });
                    forceUpdate();
                  }}
                >
                  {canteen.floors.map(floor => (
                    <Select.Option key={floor} value={String(floor)}>
                      {floor}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )
          );
        })()}
        {form.getFieldValue('floor') && (
          <Form.Item label="窗口" name="window">
            <Input />
          </Form.Item>
        )}
        <Form.Item name="start" style={{ display: 'none' }} />
        <Form.Item name="end" style={{ display: 'none' }} />
        <Form.List name="ranges" initialValue={[[]]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index, array) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    label={'供应时间' + String(index)}
                    name={[field.name, String(index)]}
                    rules={
                      index === 0
                        ? [
                            {
                              required: true,
                              message: '至少填写一个供应时间',
                            },
                          ]
                        : []
                    }
                  >
                    <TimePicker.RangePicker format="HH:mm" />
                  </Form.Item>
                  {array.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={add} block icon={<PlusOutlined />}>
                  添加供应时间
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          label="菜品价格"
          name="price"
          rules={[
            {
              required: true,
              message: '请填写菜品价格，如果比较模糊可以选择填写预估人均价格',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="昵称" name="reporter">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
