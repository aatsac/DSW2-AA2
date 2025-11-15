# DSW2 – AA2

Aplicação front-end desenvolvida para a disciplina **Desenvolvimento de Software para Web 2 (DSW2)** da UFSCar.

O projeto foi criado com **Vite + React** e implementa uma interface básica com páginas de cadastro, login e navegação entre diferentes telas da aplicação.

---

## 🧩 Funcionalidades básicas

De forma geral, a aplicação contém as seguintes páginas (em `src/pages/`):

- **Home.jsx**  
  Página inicial da aplicação, ponto de entrada para o usuário.

- **Login.jsx**  
  Tela de autenticação do usuário.

- **CadastroUsuario.jsx**  
  Formulário para cadastro de novos usuários no sistema.

- **Loja.jsx**  
  Página de listagem/visualização de itens disponíveis (loja).

- **LojaCadastro.jsx**  
  Tela para cadastro/gerenciamento dos itens da loja.

- **Cliente.jsx**  
  Tela relacionada às informações/visão do cliente.

- **Propostas.jsx**  
  Tela para visualização/cadastro de propostas (por exemplo, propostas de compra/negócio).

As imagens utilizadas pela interface encontram-se em `public/img/` e os estilos principais em `src/App.css`, `src/index.css` e `src/assets/style.css`.

---

## 🚀 Como executar o projeto

Pré-requisitos:
- **Node.js** (LTS recomendado)
- **npm** (instalado junto com o Node)

Passos:

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar o servidor de desenvolvimento
npm run dev
