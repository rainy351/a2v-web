# A2V Web

**A2V Web** (Amnezia to VLESS) is a professional-grade, privacy-focused utility designed to transform AmneziaVPN configurations into standard VLESS URLs. 

Everything happens locally in your browser. **Zero data leaves your device.**

## ✨ Features

- **Secure Local Conversion**: All processing is done client-side using WebAssembly/JavaScript.
- **Drag & Drop Support**: Simply drag your `.vpn` export from AmneziaVPN into the app.
- **One-Click Copy**: Instantly copy your generated VLESS URL to use in any compatible client (v2rayN, Shadowrocket, Nekobox, etc.).
- **Mobile Friendly**: Fully responsive design for conversion on the go.
- **Modern UI**: Clean, "Atmospheric" aesthetic with smooth animations.

## 🚀 How it Works

1. **Export**: In AmneziaVPN, export your connection as a `.vpn` file or copy the `vpn://` string.
2. **Import**: Paste the string or drop the file into A2V Web.
3. **Convert**: The app decompresses the Qt-compressed configuration, parses the XRay settings, and reconstructs a standard VLESS URL.
4. **Connect**: Use the output URL in your favorite VPN client.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Decompression**: [Pako](https://github.com/nodeca/pako) (zlib port)

## 📦 Development

To run the project locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 📜 Credits

- **Developer**: [rainy351](https://github.com/rainy351)
- **Based on**: [o-kos/a2v](https://github.com/o-kos/a2v) logic.
- **AmneziaVPN**: Thanks to the [Amnezia Team](https://amnezia.org/) for their amazing open-source work.

---
*Disclaimer: This tool is not affiliated with AmneziaVPN. Use responsibly.*
