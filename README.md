# Pokedex-App

Uma **Progressive Web App** híbrida construída com **Ionic 7 + Angular 15+** (Standalone Components), que consome a [PokeAPI](https://pokeapi.co/) para:

- Listar Pokémons com paginação infinita  
- Exibir detalhes completos (sprites, habilidades, movimentos e locais de encontro)  
- Marcar e gerenciar favoritos durante a sessão  

---

## 📋 Sumário

- [Demo](#demo)  
- [Pré-requisitos](#pré-requisitos)  
- [Instalação](#instalação)  
- [Estrutura de Pastas](#estrutura-de-pastas)  
- [Rotas & Navegação](#rotas--navegação)  
- [Como Funciona](#como-funciona)  
- [Estilos e Temas](#estilos-e-temas)  
- [Testes](#testes)  
- [Melhorias Futuras](#melhorias-futuras)  
- [Licença](#licença)  

---

## Demo

| Lista de Pokémons | Detalhes | Favoritos |
|:-----------------:|:--------:|:---------:|
| ![home](https://i.imgur.com/o3uNBne.png) | ![details](https://i.imgur.com/L6hDpRi.png) | ![favorites](https://i.imgur.com/lFoToLk.png) |

---

## Pré-requisitos

- Node.js ≥ 18.x  
- npm ≥ 8.x  
- Ionic CLI ≥ 7.x  
- (Opcional) Capacitor CLI para builds mobile  

---

## Instalação

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/pokedex-app.git
   cd pokedex-app
    ```
2. **Instale as dependências**
  ```bash
  npm install
  ```
3. **Inicie o servidor de desenvolvimento**
  ```bash
  ionic serve
  ```
4. **Build para produção**
  ```bash
  ionic build
  ```
Os arquivos compilados serão gerados em www/.

---

## Estrutura de Pastas

  ```bash
  src/
  ├── app/
  │   ├── app.component.ts       # Componente raiz (ion-app + outlet)
  │   ├── routes.ts              # Rotas standalone
  │   ├── models/                # Interfaces de domínio (pokemon.model.ts)
  │   ├── services/              # LRU cache, PokeAPI client, favoritos
  │   └── pages/
  │       ├── home/              # Listagem e busca
  │       ├── details/           # Detalhes de um Pokémon
  │       └── favorites/         # Lista de favoritos
  ├── environments/              # Configurações de ambiente
  ├── global.scss                # Estilos globais
  ├── index.html                 # Template raiz
  ├── main.ts                    # Bootstrap Angular + Ionic
  ├── polyfills.ts
  └── zone-flags.ts
  ```

---

## Rotas & Navegação

Definidas em src/app/routes.ts:
  ```bash
  Path	Página
  /HomePage
  /details/:id	DetailsPage
  /favorites	FavoritesPage
  ```
Navegação via Router.navigate(['/details', id]) ou <ion-router-link>.

---

## Como Funciona

1. **HomePage**
  -  Carrega lista paginada de Pokémons (getPokemonList)
  -  Scroll infinito dispara novas páginas
  -  Busca por nome/ID com debounce de 300ms (getPokemonDetails)
  -  Toggle de favorito em cada card

2. **DetailsPage**
  -  Recebe id por rota
  -  Carrega dados de /pokemon, /pokemon-species e /pokemon/{id}/encounters em paralelo
  -  Calcula taxa de captura em %
  -  Exibe sprites e extras via AlertController
  -  Toggle de favorito com feedback via Toast
    
3. **FavoritesPage**
  -  Lista itens que o usuário marcou na sessão
  -  Remove favorito com ícone de lixeira

Todos os dados de favoritos ficam em memória (serviço FavoritesService). Para persistir entre sessões, pode-se integrar Capacitor Storage ou localStorage.

---

## Estilos e Temas

  -  global.scss: resets, tipografia e estilos globais
  -  theme/variables.scss: variáveis de cores, fontes e espaçamentos do Ionic
  -  Cada página possui seu arquivo .page.scss para estilos locais

---

## Testes

  -  Unitários para serviços em src/app/services/*.spec.ts
  -  Execução:
  ```bash
  npm test
  ```
  -  Recomendações:
    -  Adicionar testes de componentes com @angular/core/testing e IonicModule.forRoot()
    -  E2E com Cypress ou Playwright para fluxos críticos (listagem, detalhes e favoritos)

---

## Melhorias Futuras

  -  Persistência de favoritos entre sessões
  -  Tratamento de erros e loader universal
  -  Internacionalização (i18n)
  -  Acessibilidade (aria-attributes, contraste)
  -  CI/CD para lint, build e testes automatizados
