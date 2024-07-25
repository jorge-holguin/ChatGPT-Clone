document.querySelectorAll('#model-list li').forEach(item => {
    item.addEventListener('click', function() {
        const selectedModel = this.getAttribute('data-model');
        document.getElementById('chat-header-title').innerText = selectedModel;
    });
});

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('message-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const model = document.getElementById('chat-header-title').innerText;
    if (message.trim() !== '' && model !== 'Select a model') {
        addMessageToChat('user', message);
        messageInput.value = '';
        // Enviar mensaje al backend
        fetch('http://localhost:3000/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model, message })
        })
        .then(response => response.json())
        .then(data => {
            addMessageToChat('chatgpt', data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChat('chatgpt', 'Error al obtener la respuesta.');
        });
    } else if (model === 'Select a model') {
        alert('Por favor selecciona un modelo.');
    }
}

function addMessageToChat(sender, message) {
    const chatBox = document.querySelector('.chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
