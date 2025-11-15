import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function CadastroUsuario() {
  const [tipo, setTipo] = useState('cliente')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const navigate = useNavigate()
  const ano = new Date().getFullYear()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!nome || !email || !senha) {
      setErro('Preencha nome, e-mail e senha para continuar.')
      return
    }

    try {
      // verifica se já existe usuário com esse e-mail
      const resExistente = await axios.get(`${API_URL}/usuarios`, {
        params: { email },
      })

      if (resExistente.data.length > 0) {
        setErro('Já existe um usuário cadastrado com este e-mail.')
        return
      }

      // cria usuário
      const resNovo = await axios.post(`${API_URL}/usuarios`, {
        nome,
        email,
        senha,
        tipo, // 'cliente' ou 'loja'
      })

      const user = resNovo.data

      // salva sessão e redireciona
      localStorage.setItem('automarketUser', JSON.stringify(user))

      if (user.tipo === 'cliente') {
        navigate('/cliente')
      } else if (user.tipo === 'loja') {
        navigate('/loja')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      setErro('Erro ao cadastrar. Tente novamente.')
    }
  }

  return (
    <>
      <main className="container main">
        <section className="auth" aria-labelledby="cadastro-title">
          <div className="auth__card">
            <h1 id="cadastro-title" className="auth__title">
              Criar conta
            </h1>
            <p className="auth__subtitle">
              Cadastre-se como <strong>Cliente</strong> ou <strong>Loja</strong>.
            </p>

            {/* seletor de tipo de usuário centralizado */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0.75rem 0 1.5rem',
              }}
            >
              <fieldset className="segmented" aria-label="Tipo de usuário">
                <input
                  type="radio"
                  id="tipo-cliente"
                  name="tipo"
                  value="cliente"
                  checked={tipo === 'cliente'}
                  onChange={() => setTipo('cliente')}
                />
                <label htmlFor="tipo-cliente">Cliente</label>

                <input
                  type="radio"
                  id="tipo-loja"
                  name="tipo"
                  value="loja"
                  checked={tipo === 'loja'}
                  onChange={() => setTipo('loja')}
                />
                <label htmlFor="tipo-loja">Loja</label>
              </fieldset>
            </div>

            <form className="auth__form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Seu nome ou nome da loja"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
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
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              {erro && (
                <p className="auth__hint" style={{ color: 'red' }}>
                  {erro}
                </p>
              )}
              {mensagem && (
                <p className="auth__hint" style={{ color: 'green' }}>
                  {mensagem}
                </p>
              )}

              <button className="btn btn--primary auth__submit" type="submit">
                Cadastrar
              </button>
            </form>

            <p className="auth__hint">
              Já tem conta?{' '}
              <Link to="/login" className="auth__link">
                Entrar
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
