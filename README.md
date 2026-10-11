# 🚗 ParkFlow API

API Backend desenvolvida em Node.js e Express para o gerenciamento de estacionamentos, controle de veículos, clientes e usuários.

## 🛠️ Tecnologias Utilizadas
- **Node.js** & **Express** (Framework HTTP)
- **SQLite** & **SQLite3** (Banco de dados relacional)
- **JWT (JSON Web Token)** (Autenticação de rotas)
- **Bcrypt** (Criptografia de senhas)

---

## 📌 Rotas da API

### 🔓 Rotas Públicas (Sem Autenticação)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **POST** | `/login` | Realiza o login do usuário e retorna o token JWT |
| **POST** | `/users` | Cadastra um novo usuário no sistema |

---

### 🔒 Rotas Protegidas (Exigem Token Bearer no Header)
*Para acessar estas rotas, envie o token no header da requisição:* `Authorization: Bearer <seu_token>`

#### 🚗 Veículos (`/vehicles`)
| Método | Rota | Descrição | Exemplo de Body (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/vehicles` | Lista todos os veículos cadastrados | - |
| **POST** | `/vehicles` | Cadastra um novo veículo | `{"model_vehicle": "Civic", "year_vehicle": 2022, "label_vehicle": "ABC1D23", "owner_vehicle": 1}` |
| **PUT** | `/vehicles/:id` | Atualiza dados de um veículo | `{"new_model": "Civic Touring"}` |
| **DELETE** | `/vehicles/:id` | Remove um veículo pelo ID | - |

#### 👥 Clientes (`/clients`)
| Método | Rota | Descrição | Exemplo de Body (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/clients` | Lista todos os clientes | - |
| **POST** | `/clients` | Cadastra um novo cliente | `{"name_client": "Renato", "email_client": "renato@email.com"}` |
| **PUT** | `/clients/:id` | Atualiza dados de um cliente | `{"new_name": "Renato Fillipo"}` |
| **DELETE** | `/clients/:id` | Deleta cliente e seus veículos vinculados | - |

#### 🅿️ Estacionamentos (`/parks`)
| Método | Rota | Descrição | Exemplo de Body (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/parks` | Lista todos os estacionamentos | - |
| **POST** | `/parks` | Cadastra um estacionamento | `{"park_name": "Estacionamento Central", "park_owner": "Renato"}` |
| **PUT** | `/parks/:id` | Atualiza o nome do estacionamento | `{"new_name": "Park Premium"}` |
| **DELETE** | `/parks/:id` | Remove um estacionamento | - |

---