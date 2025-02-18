import { auth, database } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

// Função para cadastrar um usuário
export const cadastrarUsuario = async (usuario) => {
    try {
    // Criar usuário na autenticação
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      usuario.email,
      usuario.senha
    );
    
    // Salvar dados no Realtime Database
    await set(ref(database, 'usuarios/' + userCredential.user.uid), {
      nome: usuario.nome,
      email: usuario.email,
      dataCadastro: new Date().toISOString()
    });

    return { success: true, user: userCredential.user };
    
    } catch (error) {
    let message = "Erro ao cadastrar";
    switch(error.code) {
      case 'auth/email-already-in-use': 
        message = "E-mail já cadastrado";
        break;
      case 'auth/weak-password':
        message = "Senha deve ter 6+ caracteres";
        break;
      case 'auth/invalid-email':
        message = "E-mail inválido";
        break;
    }
    throw new Error(message);
  }
};

export const fazerLogin = async ({ email, senha }) => {
    try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return { success: true, user: userCredential.user };
    } catch (error) {
    let message = "Erro no login";
    switch(error.code) {
      case 'auth/user-not-found':
        message = "Usuário não encontrado";
        break;
      case 'auth/wrong-password':
        message = "Senha incorreta";
        break;
    }
    throw new Error(message);
    }
};