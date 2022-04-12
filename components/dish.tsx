import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Card, List, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const timeString = (second: number) => `${Math.floor(second / 60)}:${second % 60}`;

export const DishDisplay: React.FC<{ dish: Dish; audit?: boolean }> = ({ dish, audit = false }) => {
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const onApprove = useCallback(async (id: number, approve: boolean) => {
    if (processing) {
      return;
    }
    setProcessing(true);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await (
      await fetch('/api/audit', { method: 'POST', headers, body: JSON.stringify({ id, approve }) })
    ).json();
    if (response.code === 0) {
      message.success('提交成功');
      setProcessed(true);
    } else {
      message.error('提交失败');
      setProcessing(false);
    }
  }, []);

  return !processed ? (
    <Card
      bordered
      hoverable
      style={{
        width: '90%',
        margin: 'auto',
      }}
      cover={<Image width="100%" height="100%" src={`/img/${dish.img}`} alt="image" />}
      actions={
        audit
          ? [
              <CheckOutlined
                key="approve"
                style={{ color: 'green' }}
                onClick={() => onApprove(dish.id as number, true)}
                spin={processing}
              />,
              <CloseOutlined
                key="reject"
                style={{ color: 'red' }}
                onClick={() => onApprove(dish.id as number, false)}
                spin={processing}
              />,
            ]
          : []
      }
    >
      <Card.Meta
        title={'' + dish.name}
        description={
          <>
            食堂：{dish.canteen}
            {dish.floor && (
              <>
                <br />
                楼层：{dish.floor}
              </>
            )}
            {dish.window && (
              <>
                <br />
                窗口：{dish.window}
              </>
            )}
            <br />
            价格：{dish.price}
            <br />
            供应时间：{timeString(dish.start)}-{timeString(dish.end)}
            {dish.remark && (
              <>
                <br />
                备注：{dish.remark}
              </>
            )}
            {dish.reporter && (
              <>
                <br />
                记录人：{dish.reporter}
              </>
            )}
          </>
        }
      />
    </Card>
  ) : null;
};

export const ReportList: React.FC<{ reports: Dish[] }> = ({ reports }) => {
  return (
    <List
      pagination={{
        pageSize: 20,
      }}
      dataSource={reports}
      renderItem={item => (
        <List.Item key={item.id}>
          <DishDisplay dish={item} audit={true} />
        </List.Item>
      )}
    />
  );
};
