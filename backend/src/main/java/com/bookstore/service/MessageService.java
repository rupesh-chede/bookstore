package com.bookstore.service;

import com.bookstore.dto.SendMessageRequest;
import com.bookstore.model.Message;
import com.bookstore.repository.MessageRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired private MessageRepository messageRepository;
    @Autowired private UserRepository userRepository;

    public Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    public Message sendMessage(Long userId, SendMessageRequest request) {
        Message message = new Message();
        message.setUserId(userId);
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setNumber(request.getNumber());
        message.setMessage(request.getMessage());
        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAllByOrderByIdDesc();
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}
