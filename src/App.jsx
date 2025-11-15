import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Cliente from './pages/Cliente.jsx'
import Propostas from './pages/Propostas.jsx'
import Loja from './pages/Loja.jsx'
import LojaCadastro from './pages/LojaCadastro.jsx'
import CadastroUsuario from './pages/CadastroUsuario.jsx'

function Topbar() {
  const location = useLocation()

  let user = null
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('automarketUser')
    if (stored) {
      user = JSON.parse(stored)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('automarketUser')
    window.location.href = '/'
  }

  const pathname = location.pathname
  const isPrivateArea =
    pathname.startsWith('/cliente') ||
    pathname.startsWith('/propostas') ||
    pathname.startsWith('/loja')

  const isLoginPage = pathname === '/login'

  let logoTo = '/'
  if (user && isPrivateArea) {
    if (user.tipo === 'cliente') {
      logoTo = '/cliente'
    } else if (user.tipo === 'loja') {
      logoTo = '/loja'
    }
  }

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link className="logo" to={logoTo}>
          <img src="/img/logo.png" alt="AutoMarket" className="logo__img" />
        </Link>
        <nav className="nav">
          {user && (
            <>
              <span
                className="nav__user"
                style={{ marginRight: '0.75rem' }}
              >
                Olá, {user.nome}
              </span>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          )}

          {!user && (
            <>
              {isLoginPage ? (
                <Link className="btn btn--ghost" to="/">
                  Voltar
                </Link>
              ) : (
                <Link className="btn btn--ghost" to="/login">
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/propostas" element={<Propostas />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/loja/cadastrar" element={<LojaCadastro />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}
