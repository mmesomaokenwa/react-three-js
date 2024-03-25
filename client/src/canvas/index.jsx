import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei'
import Shirt from './Shirt'
import CameraRig from './CameraRig'
import Backdrop from './Backdrop'
import ShirtLoader from './ShirtLoader'

const CanvasModule = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment
        files={
          "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr"
        }
      />
      <CameraRig>
        <Backdrop />
        <Center>
          {/* <Suspense fallback={<ShirtLoader />}> */}
            <Shirt />
          {/* </Suspense> */}
        </Center>
      </CameraRig>
    </Canvas>
  );
}

export default CanvasModule