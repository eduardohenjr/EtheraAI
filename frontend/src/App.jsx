import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture, Preload } from '@react-three/drei'
import React, { Suspense, useRef } from 'react'

// ErrorBoundary para capturar erros do Canvas
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // Pode logar o erro se quiser
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color:'#fff',textAlign:'center',padding:24}}>Erro ao carregar o planeta 3D.<br/>Tente recarregar a página.</div>
    }
    return this.props.children
  }
}

function Earth() {
  // Usa Suspense para garantir carregamento das texturas
  const colorMap = useTexture('/earthmap.jpg')
  const cloudMap = useTexture('/earthclouds.png')
  if (!colorMap || !cloudMap) return null
  return (
    <group>
      {/* Planeta */}
      <mesh rotation={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          metalness={0.4} 
          roughness={0.7} 
          envMapIntensity={0.8}
        />
      </mesh>
      {/* Nuvens */}
      <mesh>
        <sphereGeometry args={[2.03, 64, 64]} />
        <meshStandardMaterial 
          map={cloudMap} 
          transparent 
          opacity={0.5} 
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function App() {
  const controlsRef = useRef()
  return (
    <div className="login-bg" style={{position: 'fixed', inset: 0, minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', overflow: 'hidden'}}>
      {/* Canvas único para estrelas e planeta */}
      <div style={{position: 'absolute', inset: 0, zIndex: 0, width: '100vw', height: '100vh', pointerEvents: 'none'}}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{color:'#fff',textAlign:'center'}}>Carregando planeta...</div>}>
            <Canvas camera={{ position: [0, 0, 3.5] }} style={{ width: '100vw', height: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }} gl={{ preserveDrawingBuffer: true, alpha: true }}>
              <color attach="background" args={['#070f1c']} />
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 3, 5]} intensity={1.2} />
              <Stars radius={10} depth={40} count={3000} factor={0.7} fade speed={1} />
              <group position={[0, 0, 0]}>
                {/* <Earth /> */}
              </group>
              <Preload all />
              <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.7}
                enablePan={false}
                minPolarAngle={Math.PI/2.2}
                maxPolarAngle={Math.PI/2.2}
                onEnd={() => {
                  if (controlsRef.current) {
                    setTimeout(() => {
                      controlsRef.current.autoRotate = true
                    }, 1500)
                  }
                }}
              />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      </div>
      {/* Wrapper central para alinhar verticalmente */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        pointerEvents: 'none',
      }}>
        <div style={{pointerEvents: 'auto', width: '100%'}}>
          <h1 className="mundivox-title" data-text="Ethera AI" style={{position: 'relative', zIndex: 2, textAlign: 'center'}}>Ethera AI</h1>
          <div className="login-container" style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center'}}>
            <form className="login-form" style={{maxWidth: 320, width: '100%', minWidth: 220, margin: '0 auto', textAlign: 'center'}}>
              <input id="login-input" className="login-input" type="text" placeholder="Usuário" />
              <input className="login-input" type="password" placeholder="Senha" />
              <div style={{display: 'flex', justifyContent: 'center', marginBottom: 12}}>
                <a href="#" style={{color: '#bfc2c7', fontSize: '0.95em', textDecoration: 'underline', cursor: 'pointer', textAlign: 'center'}}>Esqueceu a senha?</a>
              </div>
              <button className="login-btn" type="submit">Entrar</button>
            </form>
          </div>
        </div>
      </div>
      {/* Rodapé */}
      <footer className="footer">
      {new Date().getFullYear()} &copy; Desenvolvido por Eduardo Henrique
      </footer>
    </div>
  )
}

export default App
