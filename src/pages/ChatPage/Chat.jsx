import React from 'react';
import './Chat.css';
import iconcamera from '../../assets/ic_camera.svg'; 
import iconImage from '../../assets/ic_image.svg';
import iconAttach from '../../assets/ic_attach.svg';
import iconSend from '../../assets/ic_send.svg';
import iconEmoji from '../../assets/ic_emoji.svg';

function Chat() {
  return (
    <div className="body-container">
      <div className="button-container">
        <button className="back-button">← Kết nối</button>
      </div>
      <div className="chat-container">
      <div className="header-chat">
        <div className="user-info">
          <img className="avatar" src="https://i.pravatar.cc/50" alt="User Avatar" />
          <div className="user-details">
            <div className="user-name">Nguyễn Xuân Huy</div>
            <div className="user-status" style={{ textAlign: 'left' }}>Đang hoạt động</div>          </div>
        </div>
        <button className="video-button">
          <img src={iconcamera} alt="Icon Camera" className="camera-icon" /> {/* Bỏ comment và thêm className */}
          Gọi Video
        </button>
      </div>

        <div className="body-chat">
          <div className="message-left">
            <img className="avatar" src="https://i.pravatar.cc/50" alt="User Avatar" />
            <div className="message-text">Hello! Bạn đã sẵn sàng học chưa?</div>
          </div>
          <div className="message-right">
            <div className="message-text">Mình đã sẵn sàng! Let's gooooooo</div>
          </div>
          <div className="message-left">
            <img className="avatar" src="https://i.pravatar.cc/50" alt="User Avatar" />
            <div className="message-text">Đi thôi!!!</div>
          </div>
        </div>

        <div className="footer-chat">
          <div className="input-area">
            <button className="image-button">
              <img src={iconImage} alt="Image Icon" />
            </button>
            <button className="file-button">
              <img src={iconAttach} alt="Attach Icon" />
            </button>
            <div className="message-input-wrapper">
              <input type="text" placeholder="Nhập tin nhắn..." className="message-input" />
              <button className="emoji-button">
                <img src={iconEmoji} alt="Emoji Icon" />
              </button>
            </div>
            <button className="send-button">
              <img src={iconSend} alt="Send Icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;