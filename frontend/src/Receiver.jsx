
import { useEffect, useState } from "react";
import {
  Activity,
  Wifi,
  WifiOff,
  MessageSquare,
  Clock,
  CheckCircle2,
  Radio,
  RefreshCw,
} from "lucide-react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function Receiver() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();

      setMessages([...result.messages].reverse());
      setConnected(true);
      setLastUpdated(new Date());
    } catch (error) {
      setConnected(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, []);

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
            <p className="eyebrow">RECEIVER INTERFACE</p>
            <h1>Incoming Messages</h1>
            <p className="subtitle">
              Monitor messages received from the sender through REST API.
            </p>
          </div>

          <div className="live-indicator">
            <span className={`dot ${connected ? "active" : ""}`}></span>
            {connected ? "Listening for messages" : "Connecting..."}
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <MessageSquare />
            </div>
            <div>
              <p>Total Messages Received</p>
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

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Received Message History</h2>
              <p>Messages transmitted by the sender.</p>
            </div>
            <div className="heading-icon">
              <RefreshCw size={20} />
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={40} />
              <h3>No messages received yet</h3>
              <p>Waiting for Jahnavi to send a message.</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((item) => (
                <div className="message-item" key={item.id}>
                  <div className="message-top">
                    <strong>{item.sender}</strong>
                    <span className="sent-tag">
                      <CheckCircle2 size={13} /> Received
                    </span>
                  </div>

                  <p>{item.message}</p>

                  <span className="timestamp">
                    <Clock
                      size={12}
                      style={{
                        display: "inline",
                        marginRight: "5px",
                      }}
                    />
                    {new Date(item.received_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer>
          <span>REST Connect · Receiver Dashboard</span>
          <span>
            Last updated:{" "}
            {lastUpdated
              ? lastUpdated.toLocaleTimeString()
              : "Waiting..."}
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Receiver;
