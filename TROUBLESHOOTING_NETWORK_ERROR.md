# Solução de Problemas: Erro de Rede (ERR_INTERNET_DISCONNECTED)

## Erro: `auth/network-request-failed` ou `ERR_INTERNET_DISCONNECTED`

Este erro ocorre quando o navegador não consegue se conectar ao Firebase. Aqui estão as soluções:

## ✅ Soluções

### 1. Verificar Conexão com Internet
- Certifique-se de que você está conectado à internet
- Tente acessar outros sites para confirmar
- Verifique se não está em modo offline

### 2. Verificar Bloqueadores de Anúncio
- **uBlock Origin, AdBlock Plus, etc.** podem bloquear requisições do Firebase
- **Solução:** Desative temporariamente ou adicione exceções para:
  - `*.firebaseapp.com`
  - `*.googleapis.com`
  - `*.firebaseio.com`

### 3. Verificar Extensões do Navegador
- Algumas extensões de privacidade (Privacy Badger, Ghostery) podem bloquear requisições
- **Solução:** Desative temporariamente ou teste em modo anônimo/privado

### 4. Verificar CORS (Cross-Origin Resource Sharing)
- O Firebase deve estar configurado corretamente no projeto
- **Solução:** Verifique no Firebase Console:
  1. Vá para **Authentication** → **Settings** → **Authorized domains**
  2. Certifique-se de que `localhost` está na lista (para desenvolvimento)
  3. Adicione seu domínio se estiver em produção

### 5. Verificar Firewall/Antivírus
- Firewalls corporativos ou antivírus podem bloquear requisições
- **Solução:** Adicione exceções para o Firebase ou desative temporariamente

### 6. Limpar Cache do Navegador
- Cache corrompido pode causar problemas
- **Solução:** 
  - Pressione `Ctrl+Shift+Delete` (Windows/Linux) ou `Cmd+Shift+Delete` (Mac)
  - Limpe cache e cookies
  - Recarregue a página

### 7. Testar em Outro Navegador
- O problema pode ser específico do navegador
- **Solução:** Tente em Chrome, Firefox, Edge, etc.

### 8. Verificar Console do Navegador
- Abra o console (F12) e verifique erros específicos
- **Solução:** Procure por:
  - Erros de CORS
  - Erros de rede
  - Mensagens de bloqueio

## 🔍 Como Diagnosticar

1. **Abra o Console do Navegador (F12)**
2. **Vá para a aba Network (Rede)**
3. **Tente registrar um usuário**
4. **Procure por requisições falhadas:**
   - Procure por requisições para `identitytoolkit.googleapis.com`
   - Veja o status da requisição (deve ser 200 ou 400, não ERR_*)
   - Verifique se há erros de CORS

## 📋 Checklist

- [ ] Internet está funcionando
- [ ] Bloqueadores de anúncio desativados ou configurados
- [ ] Extensões de privacidade desativadas
- [ ] `localhost` está nas authorized domains do Firebase
- [ ] Firewall/Antivírus não está bloqueando
- [ ] Cache do navegador limpo
- [ ] Testado em outro navegador
- [ ] Console do navegador verificado

## 🆘 Se Nada Funcionar

1. **Verifique o Firebase Console:**
   - Vá para https://console.firebase.google.com/
   - Selecione o projeto `estagio-13e16`
   - Verifique se o projeto está ativo
   - Verifique se Authentication está habilitado

2. **Teste a API diretamente:**
   ```javascript
   // No console do navegador (F12)
   fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAuwfo2YoVn5teLUvujL9F8SERL9-kyjwI', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@test.com', password: 'test123456', returnSecureToken: true })
   }).then(r => r.json()).then(console.log).catch(console.error);
   ```

3. **Contate o Suporte:**
   - Se o problema persistir, pode ser um problema com a configuração do Firebase
   - Verifique se o projeto Firebase está ativo e configurado corretamente

