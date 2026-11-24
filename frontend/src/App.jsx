
import { useEffect, useState } from "react";
import {
  Activity,
  Send,
  Wifi,
  WifiOff,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
  RefreshCw,
} from "lucide-react";
import "./App.css";

// Local backend for initial testing.
// Later, replace this with Amulya's laptop IP address.
const API_URL = "http://127.0.0.1:8000";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      setConnected(response.ok);
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setStatus("Please enter a message.");
      return;
    }

    setSending(true);
    setStatus("");

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "Jahnavi",
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Message transmission failed.");
      }

      const result = await response.json();

      setMessages((previous) => [
        result.data,
        ...previous,
      ]);

      setMessage("");
      setStatus("Message sent successfully!");
      setConnected(true);
    } catch (error) {
      setStatus(
        "Unable to send message. Check the receiver server connection."
      );
      setConnected(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={23} />
          </div>
          <div>
            <h2>REST Connect</h2>
            <span>Communication Monitoring System</span>
          </div>
        </div>

        <div className={`connection ${connected ? "online" : "offline"}`}>
          {connected ? <Wifi size={17} /> : <WifiOff size={17} />}
          {connected ? "API Connected" : "API Disconnected"}
        </div>
      </header>

      <main className="main-content">
        <section className="welcome">
          <div>
            <p className="eyebrow">SENDER INTERFACE</p>
            <h1>Message Communication</h1>
            <p className="subtitle">
              Send text messages to the receiver through REST API.
            </p>
          </div>
          <div className="live-indicator">
            <span className={connected ? "dot active" : "dot"}></span>
            {connected ? "System Online" : "Waiting for connection"}
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <MessageSquare />
            </div>
            <div>
              <p>Messages Sent</p>
              <h2>{messages.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Radio />
            </div>
            <div>
              <p>Communication</p>
              <h2 className="small-value">
                {connected ? "Active" : "Offline"}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Activity />
            </div>
            <div>
              <p>Protocol</p>
              <h2 className="small-value">REST / HTTP</h2>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel compose-panel">
            <div className="panel-heading">
              <div>
                <h2>Compose Message</h2>
                <p>Send a message to the receiver laptop.</p>
              </div>
              <div className="heading-icon">
                <Send size={20} />
              </div>
            </div>

            <form onSubmit={sendMessage}>
              <label>Sender</label>
              <input value="Jahnavi" disabled />

              <label>Message Content</label>
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                maxLength={500}
              />

              <div className="character-count">
                {message.length}/500 characters
              </div>

              <button
                type="submit"
                className="send-button"
                disabled={sending || !connected}
              >
                {sending ? (
                  <RefreshCw size={18} className="spin" />
                ) : (
                  <Send size={18} />
                )}
                {sending ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <div className={`status-message ${
                  status.includes("successfully") ? "success" : "error"
                }`}>
                  {status.includes("successfully") ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <AlertCircle size={17} />
                  )}
                  {status}
                </div>
              )}
            </form>
          </div>

          <div className="panel history-panel">
            <div className="panel-heading">
              <div>
                <h2>Sent Messages</h2>
                <p>Your message transmission history.</p>
              </div>
              <div className="heading-icon">
                <Clock size={20} />
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={36} />
                <h3>No messages sent yet</h3>
                <p>Your sent messages will appear here.</p>
              </div>
            ) : (
              <div className="message-list">
                {messages.map((item) => (
                  <div className="message-item" key={item.id}>
                    <div className="message-top">
                      <strong>{item.sender}</strong>
                      <span className="sent-tag">
                        <CheckCircle2 size={13} /> Sent
                      </span>
                    </div>
                    <p>{item.message}</p>
                    <span className="timestamp">
                      {new Date(item.received_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer>
          <span>REST Connect · Communication Demo</span>
          <span>HTTP · JSON · FastAPI</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
