# Como Habilitar Autenticação por Email/Senha no Firebase

## ⚠️ Erro: `auth/operation-not-allowed`

Este erro significa que a autenticação por Email/Senha não está habilitada no seu projeto Firebase.

## ✅ Solução Passo a Passo

### Passo 1: Acesse o Firebase Console
1. Vá para: https://console.firebase.google.com/
2. Faça login com sua conta Google

### Passo 2: Selecione o Projeto
1. Selecione o projeto: **estagio-13e16**
   - Se não aparecer, verifique se você tem acesso ao projeto

### Passo 3: Acesse Authentication
1. No menu lateral esquerdo, clique em **Authentication**
2. Se for a primeira vez, clique em **Get started** para habilitar o Authentication

### Passo 4: Habilite Email/Password
1. Clique na aba **Sign-in method** (Métodos de login)
2. Na lista de provedores, encontre **Email/Password**
3. Clique em **Email/Password**
4. Na janela que abrir:
   - **Enable** (Habilitar) - ative o primeiro toggle
   - **Email link (passwordless sign-in)** - opcional, pode deixar desabilitado
5. Clique em **Save** (Salvar)

### Passo 5: Verifique
1. Você deve ver **Email/Password** na lista com status **Enabled** (Habilitado)
2. Agora você pode tentar registrar um usuário novamente no aplicativo

## 📸 Visual Guide

```
Firebase Console
├── Authentication
    ├── Users (aba)
    ├── Sign-in method (aba) ← CLIQUE AQUI
    │   ├── Email/Password ← CLIQUE AQUI
    │   │   ├── Enable (toggle) ← ATIVE ESTE
    │   │   └── Save (botão) ← CLIQUE AQUI
    └── Templates (aba)
```

## ✅ Checklist

- [ ] Acessei o Firebase Console
- [ ] Selecionei o projeto correto (estagio-13e16)
- [ ] Acessei Authentication → Sign-in method
- [ ] Encontrei Email/Password na lista
- [ ] Habilitei o toggle "Enable"
- [ ] Cliquei em "Save"
- [ ] Verifiquei que Email/Password está "Enabled"
- [ ] Tentei registrar novamente no aplicativo

## 🔍 Verificação Rápida

Após habilitar, você pode verificar se está funcionando:

1. No Firebase Console → Authentication → Sign-in method
2. Procure por **Email/Password**
3. Deve mostrar: **Status: Enabled** (Habilitado)

## ⚠️ Problemas Comuns

### "Não vejo a opção Email/Password"
- Certifique-se de estar na aba **Sign-in method**
- Role a lista para baixo se necessário
- Verifique se o Authentication está habilitado (clique em "Get started" se necessário)

### "Não consigo salvar"
- Verifique se você tem permissões de administrador no projeto
- Tente atualizar a página e tentar novamente

### "Ainda recebo o erro após habilitar"
- Aguarde alguns segundos para as mudanças propagarem
- Recarregue a página do aplicativo
- Limpe o cache do navegador (Ctrl+Shift+Delete)

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:
1. Verifique se você tem acesso ao projeto Firebase
2. Verifique se o projeto está ativo
3. Tente desabilitar e reabilitar o Email/Password
4. Verifique os logs do Firebase Console para erros

