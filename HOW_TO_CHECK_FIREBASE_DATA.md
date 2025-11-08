# Como Verificar se os Dados Estão Sendo Salvos no Firebase

## Método 1: Console do Navegador (Recomendado)

1. **Abra o Console do Navegador:**
   - Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
   - Ou `Cmd+Option+I` (Mac)
   - Vá para a aba **Console**

2. **Tente Registrar um Novo Usuário:**
   - Preencha o formulário de registro
   - Clique em "Registrar"
   - Observe as mensagens no console

3. **O que procurar no console:**
   ```
   === REGISTRATION: Saving to Firestore ===
   User UID: [algum-id]
   User Data: {username: "...", email: "..."}
   === Creating User Document ===
   Document reference created: users/[uid]
   setDoc completed successfully
   === Document Created Successfully ===
   Document ID: [uid]
   Saved data: {username: "...", email: "...", ...}
   === REGISTRATION: Verification Complete - Data is in Firebase ===
   ```

4. **Se houver erro, você verá:**
   ```
   === Error Creating User Document ===
   Error code: permission-denied (ou outro código)
   Error message: [mensagem de erro]
   ```

## Método 2: Firebase Console (Verificação Visual)

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com/
   - Selecione o projeto: `estagio-13e16`

2. **Verifique o Firestore Database:**
   - No menu lateral, clique em **Firestore Database**
   - Você deve ver uma coleção chamada `users`
   - Clique em `users` para ver os documentos
   - Cada documento representa um usuário registrado

3. **Estrutura dos Dados:**
   ```
   users/
     └── [user-uid]/
         ├── username: "Nome do Usuário"
         ├── email: "email@exemplo.com"
         ├── country: "Brasil"
         ├── phone: "(11) 99999-9999"
         ├── gender: "Masculino"
         ├── birthDate: "01/01/2000"
         ├── address: "Endereço"
         ├── location: "Localização"
         ├── role: "estagiario"
         ├── isActive: true
         ├── createdAt: [timestamp]
         └── updatedAt: [timestamp]
   ```

4. **Verifique a Autenticação:**
   - No menu lateral, clique em **Authentication**
   - Vá para a aba **Users**
   - Você deve ver os usuários registrados com seus emails

## Método 3: Teste de Login

1. **Tente fazer login:**
   - Use as credenciais de um usuário registrado
   - Abra o console do navegador (F12)
   - Observe as mensagens:

2. **Mensagens esperadas no console:**
   ```
   Starting login process...
   Authenticating user...
   User authenticated: [uid]
   Fetching user data from Firestore...
   === Getting User Document ===
   === User Document Found ===
   Document data: {username: "...", email: "...", ...}
   Login successful! Navigating to Home screen...
   ```

3. **Se o documento não for encontrado:**
   ```
   === User Document Not Found ===
   Login Não Realizado
   Usuário não encontrado no banco de dados
   ```

## Problemas Comuns e Soluções

### Erro: "permission-denied"
**Causa:** Regras de segurança do Firestore bloqueando a escrita
**Solução:** Configure as regras no Firebase Console (veja FIREBASE_SETUP.md)

### Erro: "operation-not-allowed"
**Causa:** Autenticação por Email/Senha não está habilitada
**Solução:** 
1. Firebase Console → Authentication → Sign-in method
2. Habilite "Email/Password"

### Erro: "network-request-failed"
**Causa:** Problema de conexão ou Firebase não inicializado
**Solução:** Verifique sua conexão com a internet

### Dados não aparecem no Firebase Console
**Possíveis causas:**
1. Firestore Database não foi criado
2. Você está olhando o projeto errado
3. Os dados foram salvos mas você precisa atualizar a página

## Teste Rápido

Para testar rapidamente se o Firebase está funcionando, você pode executar no console do navegador:

```javascript
// Teste de conexão
import { testFirebaseConnection } from './src/utils/firebaseTest';
testFirebaseConnection();

// Listar todos os usuários
import { listAllUsers } from './src/utils/firebaseTest';
listAllUsers();
```

## Checklist de Verificação

- [ ] Firestore Database está criado no Firebase Console
- [ ] Regras de segurança do Firestore estão configuradas
- [ ] Email/Password authentication está habilitado
- [ ] Console do navegador mostra mensagens de sucesso
- [ ] Dados aparecem no Firebase Console → Firestore Database → users
- [ ] Usuários aparecem no Firebase Console → Authentication → Users

