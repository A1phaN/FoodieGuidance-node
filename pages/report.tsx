import type { NextPage } from 'next';
import Head from 'next/head';
import { DishReportForm } from '../components/report';

const Report: NextPage = () => {
  return (
    <>
      <Head>
        <title>Foodie Guidance - Report</title>
        <meta name="description" content="dish report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DishReportForm />
    </>
  );
};

export default Report;
