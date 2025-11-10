# Configuração para Expo Snack

## ⚠️ Importante

Se você está importando este projeto do GitHub para o Expo Snack e está encontrando erros sobre dependências do Firebase, siga estes passos:

## Problemas Comuns e Soluções

### 1. Erro: "Failed to resolve dependency 'firebase@^12.5.0'"

**Causa**: O repositório no GitHub pode ter uma versão antiga do Firebase no `package.json`.

**Solução**: 
1. Certifique-se de que o `package.json` tem `"firebase": "9.23.0"` (sem o `^`)
2. Se o erro persistir, o Expo Snack pode estar usando cache. Tente:
   - Limpar o cache do navegador
   - Fazer um novo import do repositório
   - Ou editar manualmente o `package.json` no Snack para usar `"firebase": "9.23.0"`

### 2. Erro: "'firebase/firestore' is not defined in dependencies"

**Causa**: O Expo Snack pode não reconhecer automaticamente os sub-pacotes modulares do Firebase v9+.

**Solução**: 
Este é um aviso do linter do Snack, mas não impede o funcionamento. O Firebase v9+ usa imports modulares que são parte do pacote principal `firebase`. 

**Se o erro persistir e impedir a execução:**
1. No editor do Snack, vá em "Dependencies" (ícone de pacote)
2. Certifique-se de que `firebase` versão `9.23.0` está listado
3. Se necessário, adicione manualmente: `firebase@9.23.0`

### 3. Estilos Não Utilizados

Os avisos sobre estilos não utilizados são apenas avisos do ESLint e não impedem a execução. Eles foram removidos nos arquivos locais, mas se ainda aparecerem no Snack, você pode ignorá-los ou removê-los manualmente.

## Passos para Importar no Snack

1. **Certifique-se de que o repositório está atualizado**:
   ```bash
   git add .
   git commit -m "Update Firebase version for Snack compatibility"
   git push
   ```

2. **No Expo Snack**:
   - Acesse [snack.expo.dev](https://snack.expo.dev)
   - Clique em "Import from GitHub"
   - Cole a URL do repositório
   - Aguarde o import

3. **Se houver erros de dependência**:
   - Clique no ícone de "Dependencies" (pacote) no painel esquerdo
   - Verifique se `firebase@9.23.0` está listado
   - Se não estiver, adicione manualmente
   - Clique em "Save" e aguarde a reinstalação

4. **Verificar se funcionou**:
   - Os avisos sobre imports modulares do Firebase podem aparecer, mas não devem impedir a execução
   - Se o app não iniciar, verifique o console para erros específicos

## Versões Testadas

- Firebase 9.23.0 ✅ (Recomendado para Snack)
- Firebase 8.10.0 ✅ (Funciona, mas usa API antiga - requer refatoração)

## Notas

- O Expo Snack gerencia dependências automaticamente
- Não é necessário `package-lock.json` no Snack
- Os imports modulares do Firebase (`firebase/firestore`, `firebase/auth`) são parte do pacote principal `firebase`

