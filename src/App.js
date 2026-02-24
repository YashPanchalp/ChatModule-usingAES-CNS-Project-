import React, { useMemo, useState } from "react";
import CryptoJS from "crypto-js";

function decryptWithKey(cipherText, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return "";
  }
}

export default function App() {
  const [newUsername, setNewUsername] = useState("");
  const [users, setUsers] = useState(["Aman", "Rahul", "Priya"]);
  const [activeUser, setActiveUser] = useState("Aman");

  const [groupKey, setGroupKey] = useState("group-secret-123");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const canSend = activeUser && groupKey.trim() && message.trim();

  const keyInfo = useMemo(() => {
    return {
      hasKey: groupKey.trim().length > 0,
      keyPreview: groupKey ? `${groupKey.slice(0, 4)}***` : "(empty)"
    };
  }, [groupKey]);

  const addUser = () => {
    const name = newUsername.trim();
    if (!name) return;
    if (users.some((user) => user.toLowerCase() === name.toLowerCase())) return;

    const updated = [...users, name];
    setUsers(updated);
    setActiveUser(name);
    setNewUsername("");
  };

  const rotateKey = () => {
    // Key rotation simulation:
    // In real systems, admin securely distributes a new symmetric key to all active members.
    // Here we simply update local state.
    const randomPart = Math.random().toString(36).slice(2, 8);
    setGroupKey(`rotated-${randomPart}`);
  };

  const sendMessage = () => {
    if (!canSend) return;

    const originalMessage = message.trim();

    // AES encryption using crypto-js
    // Requirement form:
    // CryptoJS.AES.encrypt(message, secretKey).toString();
    const encryptedMessage = CryptoJS.AES.encrypt(originalMessage, groupKey).toString();

    // AES decryption using the same symmetric key
    // Requirement form:
    // CryptoJS.AES.decrypt(cipherText, secretKey)
    const decryptedNow = decryptWithKey(encryptedMessage, groupKey);

    const newMessage = {
      id: Date.now(),
      sender: activeUser,
      originalMessage,
      encryptedMessage,
      decryptedMessage: decryptedNow,
      keyUsedAtSend: groupKey
    };

    setMessages((prev) => [newMessage, ...prev]);
    setMessage("");
  };

  return (
    <div className="app">
      <h1>Secure Group Chat Using AES (React + JavaScript)</h1>

      <div className="note">
        <strong>Short Theory (AES + Symmetric Encryption):</strong>
        <div>
          AES is a symmetric encryption algorithm, so the same secret key is used for both encryption and decryption.
          If sender and receiver use different keys, decryption fails or produces unreadable text.
        </div>
      </div>

      <div className="section grid">
        <div>
          <label>Add Username (Dynamic Users)</label>
          <div className="row">
            <input
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
              placeholder="Enter username"
            />
            <button onClick={addUser}>Add User</button>
          </div>
          <p className="small">Users: {users.join(", ")}</p>
        </div>

        <div>
          <label>Current Sender</label>
          <select value={activeUser} onChange={(event) => setActiveUser(event.target.value)}>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="section grid">
        <div>
          <label>Group Secret Key (Shared Symmetric Key)</label>
          <input
            value={groupKey}
            onChange={(event) => setGroupKey(event.target.value)}
            placeholder="Enter shared secret key"
          />
          <p className="small">
            Active key preview: <strong>{keyInfo.keyPreview}</strong>
          </p>
          <button className="secondary" onClick={rotateKey}>Simulate Key Rotation</button>
        </div>

        <div>
          <label>Message</label>
          <div className="row">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type message"
            />
            <button disabled={!canSend} onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      <div className="section">
        <strong>Chat Display</strong>
        <p className="small">
          Each entry shows sender, original message, encrypted (Base64), and decrypted text.
        </p>

        {!keyInfo.hasKey && <p className="warning">No group key set. Messages cannot be encrypted/decrypted.</p>}

        <div className="chat-list">
          {messages.length === 0 && <p className="small">No messages yet.</p>}

          {messages.map((entry) => {
            const decryptedWithCurrentKey = decryptWithKey(entry.encryptedMessage, groupKey);
            const wrongKeyCase = decryptedWithCurrentKey.length === 0;

            return (
              <div className="chat-item" key={entry.id}>
                <p><strong>Sender:</strong> {entry.sender}</p>
                <p><strong>Original message:</strong> {entry.originalMessage}</p>
                <p><strong>Encrypted message (Base64):</strong> {entry.encryptedMessage}</p>
                <p><strong>Decrypted message:</strong> {entry.decryptedMessage || "[Failed]"}</p>
                <p>
                  <strong>Decrypt with current key:</strong>{" "}
                  {wrongKeyCase ? "[Failed - wrong key or rotated key]" : decryptedWithCurrentKey}
                </p>
                <p className="small">Key used at send: {entry.keyUsedAtSend.slice(0, 4)}***</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="note">
        <strong>Key Management Demonstration:</strong>
        <ul>
          <li>All users share one group secret key (symmetric key model).</li>
          <li>The same key is required for encryption and decryption.</li>
          <li>If key changes (rotation), old messages may fail decryption with the new key.</li>
          <li>Wrong key usage produces empty/invalid decrypted output.</li>
        </ul>
      </div>

      <div className="note">
        <strong>Security Limitations (Important):</strong>
        <ul>
          <li>No backend/network security: this is local simulation only.</li>
          <li>Key is kept in frontend state and is not securely stored.</li>
          <li>No authentication or access control between users.</li>
          <li>In production, use secure key exchange, server-side controls, and stronger key handling.</li>
        </ul>
      </div>
    </div>
  );
}
