import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../../environment/environment';

interface SignalMessage {
  event: string;
  userId?: string | null;
  roomId?: string | null;
  payload: any;
}

interface UserStream {
  userId: string;
  stream?: MediaStream;
  screen?: MediaStream;
  isMuted?: boolean;
  isSharingScreen?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private socket$?: WebSocketSubject<SignalMessage>;
  public peerConnection?: RTCPeerConnection;
  private localStreamSubject = new BehaviorSubject<UserStream | null>(null);
  public localStream$ = this.localStreamSubject.asObservable();

  private remoteStreamsSubject = new BehaviorSubject<Map<string, UserStream>>(new Map());
  public remoteStreams$ = this.remoteStreamsSubject.asObservable();

  private streamInfoMap: Map<string, { userId: string, type: string }> = new Map();

  public isMicOnSubject = new BehaviorSubject<boolean>(true);
  public isCameraOnSubject = new BehaviorSubject<boolean>(true);
  isMicOn$ = this.isMicOnSubject.asObservable();
  isCameraOn$ = this.isCameraOnSubject.asObservable();
  userNow: string = localStorage.getItem("user_id") || "";
  switchCameraState() {
    this.isCameraOnSubject.next(!this.isCameraOnSubject.getValue())
  }
  switchMicroState() {
    this.isMicOnSubject.next(!this.isMicOnSubject.getValue())
  }

  async connect(userId: string, roomId: string, role: string, isCamOn: boolean, isMicOn: boolean) {
    if (this.socket$) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      const hasMicrophone = devices.some(device => device.kind === 'audioinput');

      const wantVideo = this.isCameraOnSubject.getValue();
      const wantAudio = this.isMicOnSubject.getValue();

      const constraints: MediaStreamConstraints = {
        video: wantVideo && hasCamera ? true : false,
        audio: wantAudio && hasMicrophone ? true : false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStreamSubject.next({
        userId: userId,
        stream: stream,
      });
    } catch (error) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:false,
        audio:true,
      });
      this.switchCameraState();
      this.localStreamSubject.next({
        userId: userId,
        stream: stream,
      });
      console.error('Lỗi lấy media stream:', error);
    }

    this.socket$ = webSocket<SignalMessage>({
      url: environment.wsMedia,
      openObserver: {
        next: async () => {
          console.log('Media WS connected');
          this.send({ event: 'join', userId: userId, roomId: roomId, payload: { "role": role, "isCamOn": isCamOn, "isMicOn": isMicOn } });

          this.createPeerConnection(userId);

          const streams = [];
          const streamData = this.localStreamSubject.getValue()?.stream
          if (streamData != null) {
            const audioTrack = streamData.getAudioTracks()[0];
            if (audioTrack) streams.push({ trackId: audioTrack.id, type: "audio" });
            const videoTrack = streamData.getVideoTracks()[0];
            if (videoTrack) streams.push({ trackId: videoTrack.id, type: "video" });
          }
          const screenData = this.localStreamSubject.getValue()?.screen
          if (screenData != null) {
            const screenTrack = screenData.getVideoTracks()[0];
            if (screenTrack) streams.push({ trackId: screenTrack.id, type: "screen" });
          }

          if (this.peerConnection) {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            this.send({
              event: 'offer',
              userId: userId,
              roomId: roomId,
              payload: {
                "offer": {
                  type: offer.type,
                  sdp: offer.sdp,
                },
                "streams": streams,
              },
            });
          }
        },
      },
      closeObserver: {
        next: (error) => {
          console.log(error)
          console.log('Media WS disconnected');
          this.cleanup();
        },
      },
    });

    this.socket$.subscribe({
      next: (msg) => { this.handleSignal(msg); },
      error: (err) => console.error('Media WS error:', err),
      complete: () => console.log('Media WS closed'),
    });
  }

  disconnect() {
    this.socket$?.complete();
    this.socket$ = undefined;
    this.cleanup();
  }

  private cleanup() {
    this.peerConnection?.close();
    this.peerConnection = undefined;
    const currentStream = this.localStreamSubject.getValue()?.stream;
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      this.localStreamSubject.next(null)
    }
    this.socket$ = undefined;
    this.remoteStreamsSubject.next(new Map());
    this.streamInfoMap.clear();
  }

  private send(msg: SignalMessage) {
    this.socket$?.next(msg);
  }

  private createPeerConnection(userId: string) {
    if (this.peerConnection) return;

    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' }
      ],
    });
    const currentStream = this.localStreamSubject.getValue()?.stream
    if (currentStream != null) {
      currentStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, currentStream);
      });
    } else {
      console.warn('Không có local stream: thêm transceiver giả');
      this.peerConnection.addTransceiver('video', { direction: 'recvonly' });
      this.peerConnection.addTransceiver('audio', { direction: 'recvonly' });
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const cand = event.candidate;
        this.send({
          event: 'ice-candidate',
          payload: {
            candidate: {
              candidate: cand.candidate,
              sdpMid: cand.sdpMid,
              sdpMLineIndex: cand.sdpMLineIndex,
            }
          },
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      const stream = event.streams[0];
      console.log("Media track", stream.getTracks());
      if (!stream) return;

      const info = this.streamInfoMap.get(stream.id);
      if (!info) {
        console.warn("Không xác định được stream:", stream.id);
        return;
      }
      const { userId, type } = info;

      // Lấy current UserStream nếu có sẵn
      const currentMap = new Map(this.remoteStreamsSubject.getValue());
      const existingUser = currentMap.get(userId) || { userId };

      // Gán đúng loại stream
      if (type === "video") {
        existingUser.stream = stream;
      } else if (type === "screen") {
        existingUser.screen = stream;
      } else if (type === "audio") {
        existingUser.stream = stream;
      }

      currentMap.set(userId, existingUser);
      this.remoteStreamsSubject.next(currentMap);

      const videoEvent = new CustomEvent('remoteStream', {
        detail: { streamId: stream.id, stream, type },
      });
      window.dispatchEvent(videoEvent);
    };
  }

  private async handleSignal(msg: SignalMessage) {
    const { event, payload } = msg;
    switch (event) {
      case 'offer':
        if (this.peerConnection != null) {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription({
              type: 'offer',
              sdp: payload.sdp,
            }));

          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          const offer = this.peerConnection.localDescription
          this.send({
            event: 'answer',
            payload: {
              sdp: this.peerConnection.localDescription?.sdp,
            },
          });
        }
        break;
      case 'answer':
        if (!this.peerConnection) return;
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(payload.sdp)
        );
        break;

      case 'ice-candidate':
        if (!this.peerConnection) return;
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(payload.candidate)
        );
        break;
      case 'new-stream':
        if (msg.userId && payload?.trackId && payload?.type) {
          this.streamInfoMap.set(payload.streamId, {
            userId: msg.userId,
            type: payload.type,
          });
        }
        this.send({
          event: "request-pli",
          userId: msg.userId,
          payload: {
          }
        })
        break;
      case "user-leave":
        const userIdLeave = msg.userId
        if (userIdLeave == this.userNow) {
          break;
        }
        if (userIdLeave != undefined) {
          this.streamInfoMap.delete(userIdLeave);
          const currentMap = this.remoteStreamsSubject.getValue();
          const userStream = currentMap.get(userIdLeave);
          if (userStream != null) {
            userStream.stream?.getTracks().forEach(track => track.stop());
          }
          currentMap.delete(userIdLeave)
          this.remoteStreamsSubject.next(currentMap);
        }
        break;


      default:
        console.warn('Unhandled signal event:', event);
    }
  }

  getLocalStream(): UserStream | null {
    return this.localStreamSubject.getValue();
  }
}
