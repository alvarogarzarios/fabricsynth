# Fabricsynth

Fabricsynth is an interactive audiovisual garment design platform, live at [fabricsynth.com](https://fabricsynth.com). It blends 3D clothing simulation with generative visuals powered by [p5.js](https://p5js.org/) and [Hydra](https://hydra.ojack.xyz/).

Originally started as a live-coding experiment combining p5.js sketches with Hydra video synth patches, the project has evolved into a full web experience for designing and previewing digital garments—while still keeping p5 and Hydra at its core for visuals and interaction.

## 🚀 Quick Start (Local Development)

```
npm install
npm run dev
```

Open `http://localhost:5173`. The production site runs at [fabricsynth.com](https://fabricsynth.com). [attached_file:1]

## 📁 Project Structure

```
fabricsynth/
├── app/                 # Remix routes, loaders, and UI
│   ├── routes/          # Pages (design, preview, performance, etc.)
│   └── lib/             # 3D utils, audio/visual hooks, garment logic
├── public/              # Static assets (textures, small models, icons)
├── tailwind.config.js   # Design system tokens & theming
```


## 🛠️ Development Commands

```
| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start dev server with HMR           |
| `npm run build`   | Build for production                |
| `npm start`       | Run production server               |
| `npm run lint`    | Lint source files                   |
| `npm run typecheck` | Type-check TypeScript            |
```

## 🌐 Deployment

The live site at [fabricsynth.com](https://fabricsynth.com) is deployed from the `main` branch. Build output from `npm run build` is used by the host to serve both the Remix server and client bundles. [attached_file:1]

## 🎨 Tech Stack

- **Framework**: Remix (full-stack React)
- **Rendering**: WebGL via Three.js
- **Generative visuals**: [p5.js](https://p5js.org/) and [Hydra](https://hydra.ojack.xyz/)
- **Styling**: Tailwind CSS
- **Build**: Vite-based Remix toolchain

## 🔭 Vision

- Keep the live-coding spirit of the original p5.js + Hydra synth, while exposing it through a more approachable web interface.
- Let users design garments, map parameters to visuals and sound, and use Fabricsynth as both a design tool and performance instrument.

## 🤝 Contributing

1. Fork and clone the repo.
2. Install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feat/your-feature`
4. Commit and push: `git commit -m "feat: add …"` then `git push origin feat/your-feature`
5. Open a pull request against `main`.
```

Sources
