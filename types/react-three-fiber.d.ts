import '@react-three/fiber';

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    ambientLight: any;
    pointLight: any;
    spotLight: any;
    directionalLight: any;
    hemisphereLight: any;
    planeGeometry: any;
    boxGeometry: any;
    sphereGeometry: any;
    cylinderGeometry: any;
    coneGeometry: any;
    torusGeometry: any;
    meshStandardMaterial: any;
    meshBasicMaterial: any;
    meshPhongMaterial: any;
    meshLambertMaterial: any;
    meshNormalMaterial: any;
    lineBasicMaterial: any;
    // Add other Three.js elements as needed
  }
} 