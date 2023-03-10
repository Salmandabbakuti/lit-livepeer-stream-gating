import Head from 'next/head';
import Link from "next/link";
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Lit x Livepeer | Home </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.banner}>
        <Image src="/images/hero.svg" alt="lit-logo" width={400} height={450} />
        <Link href="/create">
          <button className={styles.createButton} >Create Stream</button>
        </Link>
        < Link href="/watch">
          <button className={styles.watchButton}>Watch Stream</button>
        </Link>
      </div>
    </div>
  );
};
