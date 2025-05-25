document.addEventListener('DOMContentLoaded', function() {
    const usernameModal = document.getElementById('username-modal');
    const usernameInput = document.getElementById('username-input');
    const usernameSubmit = document.getElementById('username-submit');
    const chatContainer = document.getElementById('chat-container');
    const displayUsername = document.getElementById('display-username');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat');
    
    let username = localStorage.getItem('chatUsername');
    
    // Si ya hay un nombre guardado, ocultar el modal
    if (username) {
        usernameModal.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        displayUsername.textContent = username;
        loadMessages();
    }
    
    // Manejar envío del nombre de usuario
    document.getElementById('username-submit').addEventListener('click', function() {
        username = usernameInput.value.trim();
        if (username === '') {
            alert('Por favor ingresa un nombre');
            return;
        }
        
        // Guardar nombre y mostrar chat
        localStorage.setItem('chatUsername', username);
        usernameModal.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        displayUsername.textContent = username;
        loadMessages();
    });
    
    // También permitir enviar con Enter
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('username-submit').click();
        }
    });
    
    // Enviar mensaje al presionar Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Enviar mensaje al hacer clic en el botón
    sendButton.addEventListener('click', sendMessage);
    
    // Borrar todo el chat
    clearChatButton.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial de chat?')) {
            localStorage.removeItem('chatMessages');
            chatMessages.innerHTML = '';
        }
    });
    
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;
        
        // Crear y mostrar el mensaje
        const timestamp = new Date();
        addMessageToChat('user', username, messageText, timestamp);
        
        // Guardar mensaje
        saveMessage('user', username, messageText, timestamp);
        
        // Limpiar el input
        messageInput.value = '';
        
        // Simular respuesta
        setTimeout(() => {
            const responseText = "Gracias por tu mensaje. Esto es una respuesta automática.";
            const responseTimestamp = new Date();
            addMessageToChat('other', 'Sistema', responseText, responseTimestamp);
            saveMessage('other', 'Sistema', responseText, responseTimestamp);
        }, 1000);
    }
    
    function addMessageToChat(sender, senderName, text, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender + '-message');
        
        messageDiv.innerHTML = `
            <div class="message-sender">${senderName}</div>
            <div>${text}</div>
            <div class="message-time">${formatTime(timestamp)}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function saveMessage(sender, senderName, text, timestamp) {
        // Obtener mensajes existentes o crear array vacío
        const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        
        // Añadir nuevo mensaje
        messages.push({
            sender: sender,
            senderName: senderName,
            text: text,
            timestamp: timestamp.getTime()
        });
        
        // Guardar en localStorage
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        
        messages.forEach(msg => {
            const timestamp = new Date(msg.timestamp);
            addMessageToChat(msg.sender, msg.senderName, msg.text, timestamp);
        });
    }
    
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
               ' · ' + 
               date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
});