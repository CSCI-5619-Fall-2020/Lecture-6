/* CSCI 5619 Lecture 6, Fall 2020
 * Author: Evan Suma Rosenberg
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight" 
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager"


// Required for mesh creation methods
// import {MeshBuilder} from  "@babylonjs/core/Meshes/meshBuilder";
// import "@babylonjs/core/Materials/standardMaterial"

// Side effects
import "@babylonjs/loaders/glTF/2.0/glTFLoader"
import "@babylonjs/core/Helpers/sceneHelpers";

// Import debug layer
import "@babylonjs/inspector"

// Note: The structure has changed since previous assignments because we need to handle the 
// async methods used for setting up XR. In particular, "createDefaultXRExperienceAsync" 
// needs to load models and create various things.  So, the function returns a promise, 
// which allows you to do other things while it runs.  Because we don't want to continue
// executing until it finishes, we use "await" to wait for the promise to finish. However,
// await can only run inside async functions. https://javascript.info/async-await
class Game 
{ 
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;

    constructor()
    {
        // Get the canvas element 
        this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

        // Generate the BABYLON 3D engine
        this.engine = new Engine(this.canvas, true); 

        // Creates a basic Babylon Scene object
        this.scene = new Scene(this.engine);   
    }

    start() : void 
    {
        // Create the scene and then execute this function afterwards
        this.createScene().then(() => {
            // Register a render loop to repeatedly render the scene
            this.engine.runRenderLoop(() => { 
                this.scene.render();
            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", () => { 
                this.engine.resize();
            });
        });
    }

    private async createScene() 
    {
        // This creates and positions a first-person camera (non-mesh)
        var camera = new UniversalCamera("camera1", new Vector3(0, 1.7, 0), this.scene);

        // This targets the camera to scene origin
        camera.setTarget(new Vector3(0, 1.7, -1));

        // This attaches the camera to the canvas
        camera.attachControl(this.canvas, true);

        // Some ambient light to illuminate the scene
        var ambientlight = new HemisphericLight("ambient", new Vector3(0, 1, 0), this.scene);
        ambientlight.intensity = 1.0;
        ambientlight.diffuse = new Color3(.25, .25, .25);

        // Add a directional light to imitate sunlight
        var directionalLight = new DirectionalLight("sunlight", new Vector3(0, -1, 0), this.scene);
        directionalLight.intensity = 1.0;

        /*
        // The assets manager can be used to load multiple assets
        var assetsManager = new AssetsManager(this.scene);

        // Create a task for each asset you want to load
        var worldTask = assetsManager.addMeshTask("world task", "", "assets/models/", "world.glb");
        worldTask.onSuccess = (task) => {
            task.loadedMeshes[0].name = "world";
            task.loadedMeshes[0].position = new Vector3(-75, -22, -50);
        }

        // This loads all the assets and displays a loading screen
        assetsManager.load();
        */

        const environment = this.scene.createDefaultEnvironment();

        const xrHelper = await this.scene.createDefaultXRExperienceAsync({ floorMeshes: [environment!.ground!]});

        // Show the debug layer
        //scene.debugLayer.show();
    }
}
/******* End of the Game class ******/   

// start the game
var game = new Game();
game.start();