import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function LojaCadastro() {
  const [user, setUser] = useState(null)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [km, setKm] = useState('')
  const [cambio, setCambio] = useState('')
  const [combustivel, setCombustivel] = useState('')
  const [preco, setPreco] = useState('')
  const [imagem, setImagem] = useState('')

  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()
  const ano = new Date().getFullYear()

  // Guard: só loja
  useEffect(() => {
    const stored = localStorage.getItem('automarketUser')
    if (!stored) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.tipo !== 'loja') {
      navigate('/login')
      return
    }
    setUser(parsed)
  }, [navigate])

  if (!user) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem('')
    setErro('')

    if (!nome || !km || !cambio || !combustivel || !preco) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    const kmNumber = Number(km)
    const precoNumber = Number(preco)

    if (Number.isNaN(kmNumber) || Number.isNaN(precoNumber)) {
      setErro('Quilometragem e preço devem ser números válidos.')
      return
    }

    try {
      await axios.post(`${API_URL}/carros`, {
        nome,
        descricao,
        km: kmNumber,
        cambio,
        combustivel,
        preco: precoNumber,
        imagem: imagem || '/img/civic.jpg',
        lojaId: user.id,
      })

      setMensagem('Veículo cadastrado com sucesso!')
      setNome('')
      setDescricao('')
      setKm('')
      setCambio('')
      setCombustivel('')
      setPreco('')
      setImagem('')
    } catch (err) {
      console.error(err)
      setErro('Erro ao cadastrar veículo. Tente novamente.')
    }
  }

  return (
    <>
      <main className="container main">
        <section className="auth" aria-labelledby="loja-cadastro-title">
          <div className="auth__card">
            <h1 id="loja-cadastro-title" className="auth__title">
              Cadastrar novo veículo
            </h1>
            <p className="auth__subtitle">
              Loja: <strong>{user.nome}</strong>
            </p>

            <form className="auth__form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="nome">Nome do veículo *</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Honda Civic 2020"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="descricao">Descrição</label>
                <input
                  id="descricao"
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Versão, opcionais, etc."
                />
              </div>

              <div className="field">
                <label htmlFor="km">Quilometragem *</label>
                <input
                  id="km"
                  type="number"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  placeholder="Ex: 45000"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="cambio">Câmbio *</label>
                <input
                  id="cambio"
                  type="text"
                  value={cambio}
                  onChange={(e) => setCambio(e.target.value)}
                  placeholder="Automático, Manual..."
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="combustivel">Combustível *</label>
                <input
                  id="combustivel"
                  type="text"
                  value={combustivel}
                  onChange={(e) => setCombustivel(e.target.value)}
                  placeholder="Flex, Gasolina, Diesel..."
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="preco">Preço (R$) *</label>
                <input
                  id="preco"
                  type="number"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="Ex: 89900"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="imagem">URL da imagem</label>
                <input
                  id="imagem"
                  type="text"
                  value={imagem}
                  onChange={(e) => setImagem(e.target.value)}
                  placeholder="Ex: /img/civic.jpg"
                />
                <p className="auth__hint">
                  Use imagens da pasta existente, por exemplo{' '}
                  <code>/img/civic.jpg</code>.
                </p>
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

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                <Link to="/loja" className="btn btn--ghost">
                  Voltar
                </Link>
                <button
                  className="btn btn--primary"
                  type="submit"
                  style={{ minWidth: '160px' }}
                >
                  Cadastrar veículo
                </button>
              </div>
            </form>
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
