import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { Button, Space } from 'antd';

import { DishDisplay } from '../components/dish';
import { getRandomDish } from './api/random';

interface RandomDishData {
  dish: Dish;
}

export const getServerSideProps: GetServerSideProps<RandomDishData> = async context => {
  const dish = getRandomDish();
  return dish ? { props: { dish } } : { notFound: true };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ dish }) => {
  const router = useRouter();
  const [_dish, setDish] = useState(dish);
  const random = useCallback(async () => {
    setDish((await (await fetch('/api/random')).json())?.data as Dish);
  }, []);

  return (
    <>
      <Head>
        <title>Foodie Guidance - Random</title>
        <meta name="description" content="random selector" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 style={{ textAlign: 'center' }}>清华食堂随机选择</h1>
      <DishDisplay dish={_dish} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: 20,
        }}
      >
        <Space>
          <Button type="primary" onClick={random}>
            再试一次
          </Button>
          <Button type="primary" onClick={() => router.push('/report')}>
            报告新菜
          </Button>
        </Space>
      </div>
    </>
  );
};

export default Home;
