package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.SendMessageRequest;
import com.bookstore.model.Message;
import com.bookstore.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // User: send message/contact
    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<Message>> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SendMessageRequest request) {
        Long userId = messageService.getUserIdFromEmail(userDetails.getUsername());
        Message message = messageService.sendMessage(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Message sent successfully!", message));
    }

    // Admin: get all messages
    @GetMapping("/admin/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Message>>> getAllMessages() {
        return ResponseEntity.ok(ApiResponse.ok("Messages fetched", messageService.getAllMessages()));
    }

    // Admin: delete message
    @DeleteMapping("/admin/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.ok("Message deleted!"));
    }
}
