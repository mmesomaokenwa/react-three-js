import CanvasModule from './canvas'
import Home from './pages/Home'
import Customizer from './pages/Customizer'

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Customizer />
      <CanvasModule />
    </main>
  )
}

export default App
