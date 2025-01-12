class MessagingSystem {
    constructor() {
        this.unreadMessages = 0;
        this.unreadNotifications = 0;
        this.setupEventListeners();
        this.initializeMessaging();
    }

    setupEventListeners() {
        // New Message Modal
        document.getElementById('new-message')?.addEventListener('click', () => this.openNewMessageModal());
        document.getElementById('sendMessage')?.addEventListener('click', () => this.sendMessage());
        
        // Add modal hidden event listener
        const newMessageModal = document.getElementById('newMessageModal');
        if (newMessageModal) {
            newMessageModal.addEventListener('hidden.bs.modal', () => {
                this.cleanupModal();
            });
        }

        document.getElementById('clear-notifications')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearNotifications();
        });
        document.getElementById('view-all-messages')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.viewAllMessages();
        });
    }

    async initializeMessaging() {
        await this.loadRecipients();
        await this.loadMessages();
        await this.loadNotifications();
        this.startPolling();
    }

    async loadRecipients() {
        try {
            const response = await fetch('/api/users/list', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load recipients');
            
            const users = await response.json();
            const select = document.getElementById('messageRecipient');
            
            if (select) {
                select.innerHTML = '<option value="">Select recipient...</option>' +
                    users.map(user => `
                        <option value="${user.id}">${user.name} (${user.role})</option>
                    `).join('');
            }
        } catch (error) {
            console.error('Error loading recipients:', error);
        }
    }

    async loadMessages() {
        try {
            const response = await fetch('/api/messages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load messages');
            
            const messages = await response.json();
            const messagesList = document.querySelector('.messages-list');
            
            if (messagesList) {
                messagesList.innerHTML = messages.length ? messages.map(msg => `
                    <div class="p-2 border-bottom ${msg.unread ? 'bg-light' : ''}" data-message-id="${msg.id}">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>${msg.sender}</strong>
                            <small class="text-muted">${new Date(msg.timestamp).toLocaleString()}</small>
                        </div>
                        <div class="text-truncate">${msg.subject}</div>
                        <small class="text-muted text-truncate d-block">${msg.preview}</small>
                    </div>
                `).join('') : '<div class="p-3 text-center text-muted">No messages</div>';
            }

            // Update badge
            this.unreadMessages = messages.filter(msg => msg.unread).length;
            this.updateMessagesBadge();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async loadNotifications() {
        try {
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load notifications');
            
            const notifications = await response.json();
            const notificationsList = document.querySelector('.notifications-list');
            
            if (notificationsList) {
                notificationsList.innerHTML = notifications.length ? notifications.map(notif => `
                    <div class="p-2 border-bottom ${notif.unread ? 'bg-light' : ''}" data-notification-id="${notif.id}">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>${notif.title}</strong>
                            <small class="text-muted">${new Date(notif.timestamp).toLocaleString()}</small>
                        </div>
                        <small class="text-muted">${notif.message}</small>
                    </div>
                `).join('') : '<div class="p-3 text-center text-muted">No notifications</div>';
            }

            // Update badge
            this.unreadNotifications = notifications.filter(notif => notif.unread).length;
            this.updateNotificationsBadge();
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    startPolling() {
        // Poll for new messages and notifications every 30 seconds
        setInterval(() => {
            this.loadMessages();
            this.loadNotifications();
        }, 30000);
    }

    updateMessagesBadge() {
        const badge = document.getElementById('messages-badge');
        if (badge) {
            badge.textContent = this.unreadMessages;
            badge.style.display = this.unreadMessages ? 'block' : 'none';
        }
    }

    updateNotificationsBadge() {
        const badge = document.getElementById('notifications-badge');
        if (badge) {
            badge.textContent = this.unreadNotifications;
            badge.style.display = this.unreadNotifications ? 'block' : 'none';
        }
    }

    openNewMessageModal() {
        const modal = new bootstrap.Modal(document.getElementById('newMessageModal'));
        modal.show();
    }

    async sendMessage() {
        const recipient = document.getElementById('messageRecipient').value;
        const subject = document.getElementById('messageSubject').value;
        const content = document.getElementById('messageContent').value;

        if (!recipient || !subject || !content) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipientId: recipient,
                    subject,
                    content
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            if (data.success) {
                // Close modal properly
                const modalElement = document.getElementById('newMessageModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                
                // Reload messages
                this.loadMessages();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Show error message
            const toast = new bootstrap.Toast(document.getElementById('errorToast'));
            document.getElementById('errorToastMessage').textContent = error.message || 'Failed to send message. Please try again.';
            toast.show();
        }
    }

    async clearNotifications() {
        try {
            const response = await fetch('/api/notifications/clear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to clear notifications');

            // Reload notifications
            this.loadNotifications();
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    }

    viewAllMessages() {
        // Navigate to messages page
        window.app.loadPage('messages');
    }

    cleanupModal() {
        // Remove modal backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        // Clean up body classes and styles
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Reset form
        const form = document.getElementById('newMessageForm');
        if (form) {
            form.reset();
        }
    }
}

// Initialize messaging system
window.messaging = new MessagingSystem();
