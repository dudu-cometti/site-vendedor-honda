import { auth, database } from './firebaseconfig.js';
import { ref, get, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Botão de sair
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  }).catch((error) => console.error('Erro ao sair:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userRef = ref(database, 'usuarios/' + user.uid);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          document.getElementById('sellerName').textContent = data.nome || 'Nome do Vendedor';
          document.getElementById('sellerPhone').textContent = `Telefone: ${data.phone || '(00) 00000-0000'}`;
          document.getElementById('sellerInstagram').textContent = `${data.instagram || 'instagram'}`;
          document.getElementById('sellerFacebook').textContent = `${data.facebook || 'facebook'}`;
          document.getElementById('sellerWhatsapp').textContent = `${data.whatsapp || 'whatsapp'}`;
          document.getElementById('sellerTiktok').textContent = `${data.tiktok || 'tiktok'}`;
          
          // Carregar foto de perfil
          if (data.fotoPerfil) {
            document.getElementById('profilePhoto').src = data.fotoPerfil;
          }
        } else {
          alert('Nenhum dado encontrado.');
        }
      }).catch((error) => console.error('Erro ao buscar dados:', error));
    } else {
      window.location.href = 'login.html';
    }
  });

  // Botão separado para alterar foto de perfil
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  changePhotoBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const user = auth.currentUser;
        const storage = getStorage();
        const fileRef = storageRef(storage, `profilePhotos/${user.uid}/${file.name}`);
        
        document.getElementById('loader').style.display = 'flex'; // Mostra o loader

        try {
          await uploadBytes(fileRef, file);
          const photoURL = await getDownloadURL(fileRef);

          await set(ref(database, 'usuarios/' + user.uid + '/fotoPerfil'), photoURL);
          document.getElementById('profilePhoto').src = photoURL;
          alert('Foto de perfil alterada com sucesso!');
          document.getElementById('loader').style.display = 'none'; // Esconde o loader
        } catch (error) {
          console.error('Erro ao carregar imagem:', error);
          alert('Erro ao carregar imagem.');
        }
        
      }
    });
  });

  // Modal de editar perfil
  const editProfileBtn = document.getElementById('editProfileBtn');
  const editModal = document.getElementById('editModal');
  const cancelBtn = document.getElementById('cancelBtn');
  editProfileBtn.addEventListener('click', () => editModal.style.display = 'block');
  cancelBtn.addEventListener('click', () => editModal.style.display = 'none');

  const editProfileForm = document.getElementById('editProfileForm');
  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert('Usuário não autenticado.');

    const newData = {
      nome: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      instagram: document.getElementById('instagram').value,
      facebook: document.getElementById('facebook').value,
      whatsapp: document.getElementById('whatsapp').value,
      tiktok: document.getElementById('tiktok').value
    };

    set(ref(database, 'usuarios/' + user.uid), newData)
      .then(() => {
        alert('Perfil atualizado com sucesso!');
        editModal.style.display = 'none';
        window.location.reload();
      })
      .catch((error) => {
        console.error('Erro ao salvar dados:', error);
        alert('Erro ao salvar dados.');
      });
  });
});