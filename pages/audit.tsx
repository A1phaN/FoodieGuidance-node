import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { ReportList } from '../components/dish';

import { selectAllReport } from '../database';

interface ReportedDishData {
  reports: Dish[];
}

export const getServerSideProps: GetServerSideProps<ReportedDishData> = async context => {
  return { props: { reports: selectAllReport() } };
};

const Check: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ reports }) => {
  return (
    <>
      <Head>
        <title>Foodie Guidance - Audit</title>
        <meta name="description" content="random selector" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 style={{ textAlign: 'center' }}>报告审核</h1>
      <ReportList reports={reports} />
    </>
  );
};

export default Check;
