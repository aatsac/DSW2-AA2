import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (!email || !senha) {
      setErro('Preencha e-mail e senha para continuar.')
      return
    }

    try {
      // busca por email e senha, tipo vem do usuário encontrado
      const res = await axios.get(`${API_URL}/usuarios`, {
        params: { email, senha },
      })

      if (res.data.length === 0) {
        setErro('Credenciais inválidas.')
        return
      }

      const user = res.data[0]

      // salva sessão
      localStorage.setItem('automarketUser', JSON.stringify(user))

      // redireciona conforme o tipo do usuário
      if (user.tipo === 'cliente') {
        navigate('/cliente')
      } else if (user.tipo === 'loja') {
        navigate('/loja')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      setErro('Erro ao fazer login. Tente novamente.')
    }
  }

  const ano = new Date().getFullYear()

  return (
    <>
      <main className="container main">
        <section className="auth" aria-labelledby="login-title">
          <div className="auth__card">
            <h1 id="login-title" className="auth__title">
              Entrar
            </h1>
            <p className="auth__subtitle">
              Acesse como <strong>Loja</strong> ou <strong>Cliente</strong>.
            </p>

            {/* Formulário */}
            <form className="auth__form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              {erro && <p className="auth__hint">{erro}</p>}

              <button className="btn btn--primary auth__submit" type="submit">
                Entrar
              </button>
            </form>

            <p className="auth__hint">
              Não tem conta?{' '}
              <Link to="/cadastro" className="auth__link">
                Cadastre-se
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>
            © <span>{ano}</span> AutoMarket — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}
