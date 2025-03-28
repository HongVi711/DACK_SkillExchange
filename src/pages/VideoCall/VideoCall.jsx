/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import socket from "../../socket";

import "./VideoCall.css";

// const VideoCall = () => {
//   const { chatRoomId, userid, name } = useParams();
//   const [inCall, setInCall] = useState(false);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null); // Thêm ref để lưu stream cục bộ
//   const navigate = useNavigate();
//   const location = useLocation();

//   const servers = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   const initializePeerConnection = () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close(); // Đóng kết nối cũ nếu tồn tại
//       peerConnectionRef.current = null;
//     }

//     peerConnectionRef.current = new RTCPeerConnection(servers);

//     peerConnectionRef.current.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     peerConnectionRef.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("iceCandidate", {
//           to: userid,
//           candidate: event.candidate,
//         });
//       }
//     };

//     peerConnectionRef.current.onconnectionstatechange = () => {
//       if (peerConnectionRef.current.connectionState === "disconnected" || 
//           peerConnectionRef.current.connectionState === "closed") {
//         endCall();
//       }
//     };
//   };

//   const startCall = async () => {
//     try {
//       if (!localVideoRef.current || !remoteVideoRef.current) {
//         console.error("Video elements are not available yet.");
//         return;
//       }

//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//         localStreamRef.current = null;
//       }

//       // Lấy stream từ camera/micro
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localStreamRef.current = stream;
//       localVideoRef.current.srcObject = stream;

//       // Khởi tạo RTCPeerConnection
//       initializePeerConnection();

//       // Thêm tracks vào peer connection
//       stream.getTracks().forEach((track) => {
//         peerConnectionRef.current.addTrack(track, stream);
//       });

//       // Tạo và gửi offer
//       const offer = await peerConnectionRef.current.createOffer();
//       await peerConnectionRef.current.setLocalDescription(offer);
//       socket.emit("callUser", { to: userid, offer });

//       setInCall(true);
//     } catch (error) {
//       console.error("Error starting video call:", error);
//       endCall(); // Đóng nếu có lỗi
//     }
//   };

//   const handleIncomingCall = async (from, offer) => {
//     try {
//       if (!localVideoRef.current || !remoteVideoRef.current) {
//         console.error("Video elements are not available yet.");
//         return;
//       }

//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//         localStreamRef.current = null;
//       }

//       // Lấy stream từ camera/micro
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localStreamRef.current = stream;
//       localVideoRef.current.srcObject = stream;

//       // Khởi tạo RTCPeerConnection
//       initializePeerConnection();

//       // Thêm tracks vào peer connection
//       stream.getTracks().forEach((track) => {
//         peerConnectionRef.current.addTrack(track, stream);
//       });

//       // Thiết lập offer và gửi answer
//       await peerConnectionRef.current.setRemoteDescription(
//         new RTCSessionDescription(offer)
//       );
//       const answer = await peerConnectionRef.current.createAnswer();
//       await peerConnectionRef.current.setLocalDescription(answer);
//       socket.emit("answerCall", { to: from, answer });

//       setInCall(true);
//     } catch (error) {
//       console.error("Error handling incoming call:", error);
//       endCall(); // Đóng nếu có lỗi
//     }
//   };

//   useEffect(() => {
//     const { from, offer } = location.state || {};

//     if (from && offer) {
//       handleIncomingCall(from, offer);
//     } else {
//       startCall();
//     }

//     socket.on("callAnswered", async ({ answer }) => {
//       if (
//         peerConnectionRef.current &&
//         peerConnectionRef.current.signalingState === "have-local-offer"
//       ) {
//         try {
//           await peerConnectionRef.current.setRemoteDescription(
//             new RTCSessionDescription(answer)
//           );
//         } catch (error) {
//           console.error("Error setting remote description:", error);
//         }
//       }
//     });

//     socket.on("iceCandidate", async ({ candidate }) => {
//       if (peerConnectionRef.current && candidate) {
//         try {
//           await peerConnectionRef.current.addIceCandidate(
//             new RTCIceCandidate(candidate)
//           );
//         } catch (error) {
//           console.error("Error adding ICE candidate:", error);
//         }
//       }
//     });

//     socket.on("callEnded", () => {
//       endCall();
//     });

//     return () => {
//       socket.off("callAnswered");
//       socket.off("iceCandidate");
//       socket.off("callEnded");
//       cleanup(); // Gọi hàm dọn dẹp khi component unmount
//     };
//   }, [location.state]);

//   const cleanup = () => {
//     console.log("Cleaning up resources...");
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//       console.log("Peer connection closed.");
//     }
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         track.stop();
//         console.log(`Track ${track.kind} stopped.`);
//       });
//       localStreamRef.current = null;
//       console.log("Local stream cleared.");
//     }
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//       console.log("Local video srcObject cleared.");
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//       console.log("Remote video srcObject cleared.");
//     }
//   };

//   const endCall = () => {
//     cleanup(); // Dọn dẹp tài nguyên
//     setInCall(false);
//     socket.emit("endCall", { to: userid });
//     navigate(`/chat/${chatRoomId}/${userid}/${name}`);
//   };

//   return (
//     <div className="body-container">
//       <div className="video-call-container visible">
//         <video ref={localVideoRef} autoPlay muted className="local-video" />
//         <video ref={remoteVideoRef} autoPlay className="remote-video" />
//         {inCall && (
//           <button onClick={endCall} className="end-call-button">
//             Kết thúc cuộc gọi
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
// export default VideoCall;

const VideoCall = () => {
  const { name } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      const { localStream, remoteStream } = event.data;
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteStream && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="video-call-page">
      <h2>Cuộc gọi video với {name}</h2>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted className="local-video" />
        <video ref={remoteVideoRef} autoPlay className="remote-video" />
      </div>
    </div>
  );
};
export default VideoCall;