# 🌌 Space Explorer - Three.js Scene

This project is a space-themed 3D scene built using [Three.js](https://threejs.org/). It features a fully navigable solar system with dynamic elements such as a player-controlled rocket, meteor showers, orbiting satellites, and more.

##  Features

* **Player-controlled rocket** that moves in 3D space on click
* **Free-floating camera** using OrbitControls
* **Comets with dynamic trails** circling the system
* **Orbiting satellite** with soft lighting
* **Boom planet** on the opposite side of a galaxy swirl
* **Milky Way swirl model** for aesthetic effect
* **Skybox** for immersive space background
* **Meteor shower** with randomized motion
* **Ambient stars** for depth and realism

##  File Structure

```
project-root/
├── index.html
├── main.js
├── lib/
│   ├── three.module.js
│   ├── OrbitControls.js
│   └── GLTFLoader.js
├── models/
│   ├── rocket.glb
│   ├── satellite.glb
│   ├── solar_system.glb
│   ├── boom.glb
│   └── swirl.glb
├── textures/
│   └── star.jpg
├── skybox/
│   ├── px.jpg
│   ├── nx.jpg
│   ├── py.jpg
│   ├── ny.jpg
│   ├── pz.jpg
│   └── nz.jpg
└── README.md
```

##  Controls

* **Left-click anywhere** in the scene to move the rocket to that point.
* Use **mouse drag** to rotate the camera around the rocket.
* Use **scroll wheel** to zoom in and out.

## 🔧 Requirements

* A modern browser that supports ES6 modules and WebGL (e.g., Chrome, Firefox).
* Local server (e.g., VS Code Live Server) to load `.glb` and `.jpg` assets.

##  Credits

* 3D models: [GLTF Format Resources](https://sketchfab.com), or created in Blender
* Skybox and textures: [CC0 Textures](https://cc0textures.com) or public domain resources
* Built using [Three.js](https://threejs.org/)
* "[Space Station](https://skfb.ly/ozA6I)" by re1monsen is licensed under [Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).
* "[Solar System](https://skfb.ly/6ryJH)" by valmirt is licensed under [Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).
* Background visuals from [Vecteezy - Free Space Panorama Photos](https://www.vecteezy.com/free-photos/space-panorama)

---

Enjoy exploring the cosmos! 🌠
