# ChatModule-usingAES-CNS-Project-

🔐 Secure Group Chat Using AES (React + JavaScript)
📌 What is this project?

This project is a simple group chat application built using:

React (for frontend UI)

JavaScript AES encryption (using crypto-js library)

All messages sent in the chat are encrypted using AES symmetric encryption before being displayed.

📌 What is AES?

AES (Advanced Encryption Standard) is a symmetric encryption algorithm.

👉 Symmetric means:
The same secret key is used for:

Encryption

Decryption

So, if a message is encrypted with a key, it can only be decrypted using the same key.

📌 How This Project Works (Step-by-Step)

1️⃣ User enters:

Username

Secret Key

Message

2️⃣ When user clicks Send:

The message is encrypted using AES.

Encrypted message is shown in Base64 format.

Then it is decrypted using the same key.

Decrypted message is displayed in chat.

📌 Example Flow

User: Aman
Secret Key: group123

Message: Hello

Encryption Process:

Original: Hello
Encrypted: U2FsdGVkX19d83j3kfj==
Decrypted: Hello

If another user uses the wrong key, the message cannot be decrypted properly.

📌 Key Management in This Project

A single shared secret key is used by all users.

All members must know the same key.

If the key is changed:

Old messages cannot be decrypted.

If the key is leaked:

Anyone with the key can read messages.

This demonstrates how symmetric key systems depend heavily on secure key sharing.

📌 Why Encryption is Important?

Without encryption:

Anyone can read chat messages.

With AES encryption:

Messages are protected.

Only users with the correct secret key can read them.

📌 Limitations (Basic Version)

No backend (messages stored locally).

Key is manually shared (not securely exchanged).

Not suitable for real-world secure apps without improvements.
