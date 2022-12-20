import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Player, useCreateStream, useAsset, useCreateAsset, useUpdateAsset } from '@livepeer/react';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import styles from '../../styles/Home.module.css';
import waterfallsPoster from '../../public/images/waterfall.jpg';

const PosterImage = () => {
  return (
    <Image
      alt='poster'
      src={waterfallsPoster}
      priority
      placeholder="blur"
    />
  );
};

const accessControlConditions = [
  {
    contractAddress: "0xB56946D84E4Dd277A8E575D5Dae551638010C6A8",
    standardContractType: "ERC721",
    chain: "mumbai",
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0"
    }
  }
];

export default function CreateStream() {
  const [playbackId, setPlaybackId] = useState("bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe");
  const [streamName, setStreamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [asset, setAsset] = useState(null);

  const {
    mutateAsync: createStreamAsync
  } = useCreateStream({
    name: streamName,
    record: false,
    playbackPolicy: {
      type: 'jwt'
    },
    profiles: [
      {
        name: '720p',
        bitrate: 2000000,
        fps: 30,
        width: 1280,
        height: 720,
      },
      {
        name: '480p',
        bitrate: 1000000,
        fps: 30,
        width: 854,
        height: 480,
      },
      {
        name: '360p',
        bitrate: 500000,
        fps: 30,
        width: 640,
        height: 360,
      },
      {
        name: '240p',
        bitrate: 250000,
        fps: 30,
        width: 426,
        height: 240,
      },
    ],
  });

  const { mutateAsync: createAssetAsync } = useCreateAsset({
    // file can also be an ipfs/ youtube/ vimeo link {name: 'video.mp4', url: 'https://www.youtube.com/watch?v=123456'}
    ...fileInput && {
      sources: [{ name: fileInput.name, file: fileInput }]
    }
  });

  const { mutateAsync: updateAssetAsync } = useUpdateAsset({
    ...asset && {
      assetId: asset?.id,
      storage: { ipfs: true }
    }
  });


  const resourceId = {
    baseUrl: "http://localhost:3000",
    path: "/watch-stream",
    orgId: "livepeer-org",
    role: "developer"
  };

  const handleFileUpload = async () => {
    // stream name input check empty
    if (!fileInput) return toast.error('Please select a file');
    try {
      setLoading(true);
      const asset = await createAssetAsync();
      console.log('created asset:', asset);
      setAsset(asset[0]);
      toast.success('File uploaded successfully');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Error while uploading file');
      console.log('Error while uploading file:', err);
    }
  };

  const handleUpdateAsset = async () => {
    // stream name input check empty
    if (!asset) return toast.error('Please create asset first');
    try {
      setLoading(true);
      const asset = await updateAssetAsync();
      console.log('updated asset:', asset);
      setAsset(asset);
      toast.success('Asset saved to Ipfs successfully');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Error while saving asset to Ipfs');
      console.log('Error while saving asset to Ipfs:', err);
    }
  };


  const handleCreateStream = async () => {
    // stream name input check empty
    if (/^[ ]*$/.test(streamName)) return toast.error('Please enter stream name');
    try {
      setLoading(true);
      const stream = await createStreamAsync();
      console.log('created stream:', stream);
      const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
      await client.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
      await client.saveSigningCondition({
        accessControlConditions,
        chain: "mumbai",
        authSig,
        resourceId: {
          ...resourceId,
          extraData: stream?.playbackId
        }
      });
      setStream(stream);
      setLoading(false);
      toast.success('Stream created successfully');
    } catch (err) {
      setLoading(false);
      toast.error('Error while creating stream');
      console.log('error while creating stream:', err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lit x Livepeer | Create</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>
        <h2>Create Live Stream</h2>
        <input
          className={styles.input}
          name="streamName"
          type="text"
          placeholder='Enter stream name..'
          onChange={(e) => setStreamName(e.target.value)}
        />
        <button className={styles.createButton} onClick={handleCreateStream} disabled={loading}>Create</button>
        <h2>Upload Video</h2>
        <input
          className={styles.input}
          name="fileInput"
          type="file"
          multiple={false}
          placeholder='Enter stream name..'
          onChange={(e) => setFileInput(e.target.files[0])}
        />
        <button className={styles.createButton} onClick={handleFileUpload} disabled={loading}>Upload</button>
        {stream && (
          <>
            <h2>Stream Details</h2>
            <p>Use below details to stream with streaming software like OBS</p>
            <p>Stream ID: <b>{stream.id}</b></p>
            <p>Stream Name: <b>{stream.name}</b></p>
            <p>Stream Playback ID: <b>{stream.playbackId}</b></p>
            <p>Stream Playback URL: <b>{stream.playbackUrl}</b></p>
            <p>Stream Key: <b>{stream.streamKey}</b></p>
            <p>Stream Ingest URL: <b>{stream.rtmpIngestUrl}</b></p>
            {/* watch button */}
            <Link href={`/watch?id=${stream.playbackId}`}>
              <button className={styles.watchButton}>Watch Stream</button>
            </Link>
          </>
        )}
        {asset && (
          <>
            <h2>Uploaded File details</h2>
            <p>ID: <b>{asset?.id}</b></p>
            <p>Name: <b>{asset?.name}</b></p>
            <div>IPFS CID: <b>{asset?.storage?.ipfs?.cid ?? 'None'}</b></div>
            <p>Playback ID: <b>{asset?.playbackId}</b></p>
            <p>Playback URL: <b>{asset?.playbackUrl}</b></p>
            <p>Format: <b>{asset?.videoSpec?.format}</b></p>
            <p>Duration: <b>{asset?.videoSpec?.duration}</b></p>
            {/* watch button */}
            <Link href={`/watch?id=${asset.playbackId}`}>
              <button className={styles.watchButton}>Watch Video</button>
            </Link>
            {
              !asset?.storage?.ipfs?.cid && (
                <button
                  className={styles.watchButton}
                  onClick={handleUpdateAsset}
                  disabled={loading}
                >
                  Save to IPFS
                </button>
              )
            }
          </>
        )}
        <PulseLoader loading={loading} color='#0070f3' speedMultiplier={1} />
      </div>
    </div>
  );
};
