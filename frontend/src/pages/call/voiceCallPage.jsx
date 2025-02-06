import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import AgoraRTC, { AgoraRTCProvider, useRTCClient, useJoin, useLocalMicrophoneTrack, usePublish, useRemoteUsers, useIsConnected, LocalUser, RemoteUser } from "agora-rtc-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Mic, MicOff, PhoneOff } from "lucide-react";

export const VoiceCallPage = () => {
  const { rchannelName, rtoken, token, setCalling, channel, authUser, selectedUser } = useAuthStore();

  // ✅ Step 1: Create the Agora client for audio-only
  const client = React.useMemo(() =>
    AgoraRTC.createClient({
      mode: "rtc",     // Audio-only mode for voice calls
      codec: "vp8",    // Video codec (you can ignore this for audio)
    }), []);

  return (
    <AgoraRTCProvider client={client}>
      <VoiceCallInterface client={client} appId="fc3b3de39b224f8fb86e24976baeb80f" channel={channel || rchannelName} token={token || rtoken} setCalling={setCalling} authUser={authUser} selectedUser={selectedUser} />
    </AgoraRTCProvider>
  );
};

const VoiceCallInterface = ({ client, appId, channel, token, setCalling, authUser, selectedUser }) => {
  const isConnected = useIsConnected();

  // Join the channel if the channel and token are present
  if (channel && token) {
    console.log("Joining Agora Channel for Voice Call:", channel);
    useJoin({ appid: appId, channel, token });
  }

  // ✅ Step 3: Manage audio tracks (no video tracks are involved)
  const [micOn, setMic] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  usePublish([localMicrophoneTrack]);  // Only publish the microphone track for voice calls (no video)

  const remoteUsers = useRemoteUsers();
  const rtcClient = useRTCClient(); // Access Agora RTC client
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If remote users exist, stop loading
    if (remoteUsers.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [remoteUsers]);

  useEffect(() => {
    const handleUserJoined = () => {
      setLoading(false); // Stop loading when a user joins
    };

    const handleUserLeft = () => {
      if (remoteUsers.length === 0) setLoading(true); // Restart loading if all users leave
    };

    rtcClient.on("user-joined", handleUserJoined);
    rtcClient.on("user-left", handleUserLeft);

    return () => {
      rtcClient.off("user-joined", handleUserJoined);
      rtcClient.off("user-left", handleUserLeft);
    };
  }, [rtcClient, remoteUsers]);

  return (
    <div className="h-[calc(100vh)] sm:h-[calc(100vh)] w-full bg-slate-100">
      <div className="room">
        {isConnected ? (
          <div className="user-list md:h-[calc(100vh-5rem)] flex flex-col sm:flex-row">
            {/* Local User (Only audio, no video) */}
            <div className="user h-[calc(45vh)] md:h-[calc(100vh-5rem)] w-full md:w-[calc(50vw)] flex flex-col items-center justify-center bg-black text-white">
              
              <LocalUser audioTrack={localMicrophoneTrack}>
                <img src={authUser?.profilePic || "avatar.jpg"} alt="You" className="w-full h-full" />
              </LocalUser>
            </div>
            <div className="divider divider-horizontal hidden md:block m-0 divider-neutral bg-black"></div>
            <div className="divider md:hidden m-0 divider-neutral bg-black"></div>

            {/* Remote User(s) - Only show name and profile picture */}
            {loading ? (
              <DotLottieReact
                className="user h-[calc(45vh)] md:h-[calc(100vh-5rem)] w-full md:w-[calc(50vw)] flex flex-col items-center justify-center bg-black text-white"
                src="https://lottie.host/7477a639-7813-43e5-af4b-ce1118d1c244/tmxb4P8Tk9.lottie"
                loop
                autoplay
              />
            ) : (
              remoteUsers.map((user) => (
                <div className="user h-[calc(45vh)] md:h-[calc(100vh-5rem)] w-full md:w-[calc(50vw)] flex flex-col items-center justify-center bg-black text-white" key={user.uid}>

                  <RemoteUser user={user}>
                    <img
                      src={selectedUser?.profilePic || "avatar.jpg"}
                      alt={`User ${user.uid}`}
                      className="w-full h-full"
                    />
                  </RemoteUser>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col h-screen items-center justify-center bg-[#e0e1e1]">
            <DotLottieReact
              src="https://lottie.host/3e05e1ef-3f1a-477c-8379-83a91255abff/1wsCFuTYeR.lottie"
              loop
              className="w-screen h-full my-auto"
              autoplay
            />
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control h-16 flex justify-between p-4 bg-gray-800">
          <div className="left-control flex gap-5">
            <button onClick={() => setMic((a) => !a)}>
              {!micOn ? <Mic /> : <MicOff />}
            </button>
          </div>
          <button onClick={() => setCalling(false)}>
            <PhoneOff />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCallPage;
