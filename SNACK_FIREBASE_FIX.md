# Solução para Erro "Service firestore is not available" no Expo Snack

## 🔍 Problema

O erro "Service firestore is not available" ocorre quando o Expo Snack não consegue carregar corretamente os módulos side-effect do Firebase v8.

## ✅ Soluções

### Solução 1: Verificar Dependências no Snack (RECOMENDADO)

1. **No Expo Snack, após importar o projeto:**
   - Clique no ícone de **"Dependencies"** (pacote) no painel esquerdo
   - Verifique se `firebase@8.10.0` está listado
   - Se não estiver, adicione manualmente: `firebase@8.10.0`
   - Clique em **"Save"** e aguarde a reinstalação

2. **Limpar cache:**
   - No Snack, vá em **"Device"** → **"Reload"**
   - Ou feche e reabra o projeto

### Solução 2: Editar Manualmente no Snack

Se a Solução 1 não funcionar:

1. **No editor do Snack, edite o arquivo `package.json`:**
   - Certifique-se de que tem exatamente: `"firebase": "8.10.0"` (sem `^` ou `~`)
   - Salve o arquivo

2. **Edite o arquivo `src/services/firebaseConfig.js`:**
   - Substitua o conteúdo pelo código abaixo (versão simplificada):

```javascript
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAuwfo2YoVn5teLUvujL9F8SERL9-kyjwI",
  authDomain: "estagio-13e16.firebaseapp.com",
  projectId: "estagio-13e16",
  storageBucket: "estagio-13e16.firebasestorage.app",
  messagingSenderId: "155883931109",
  appId: "1:155883931109:web:55b763826560f1d3c05b0c",
  measurementId: "G-NM4HKFL8F1"
};

if (!firebase.apps || firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const ServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export default firebase;
```

### Solução 3: Usar Firebase via CDN (Alternativa)

Se as soluções acima não funcionarem, você pode tentar usar o Firebase via CDN no Snack, mas isso requer mudanças maiores no código.

## 🔧 Verificações

1. **Verifique se o Firebase está instalado:**
   - No Snack, vá em "Dependencies"
   - Procure por `firebase`
   - Deve mostrar `firebase@8.10.0`

2. **Verifique o console:**
   - Abra o console do navegador (F12)
   - Procure por mensagens de erro relacionadas ao Firebase
   - Verifique se há mensagens de "Firebase initialized"

3. **Teste a inicialização:**
   - Adicione `console.log('Firebase:', firebase)` no início do `firebaseConfig.js`
   - Verifique se aparece no console

## 📝 Notas Importantes

- O `node_modules` **NÃO** precisa estar no Git (está correto no `.gitignore`)
- O Expo Snack instala automaticamente as dependências do `package.json`
- O problema geralmente é de cache ou ordem de carregamento dos módulos
- Às vezes é necessário fazer um "hard refresh" no Snack (Ctrl+Shift+R ou Cmd+Shift+R)

## 🆘 Se Nada Funcionar

1. Tente criar um novo Snack do zero
2. Copie e cole os arquivos manualmente
3. Adicione as dependências uma por uma
4. Teste após cada adição

## 📚 Referências

- [Firebase v8 Documentation](https://firebase.google.com/docs/web/setup)
- [Expo Snack Documentation](https://docs.expo.dev/snack/introduction/)

