package com.his.hub.notification.controller;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.notification.dto.CreateNotificationRequest;
import com.his.hub.notification.dto.NotificationDTO;
import com.his.hub.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UtilisateurRepository utilisateurRepository;

    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getMyNotifications() {
        Long utilisateurId = getCurrentUserId();
        List<NotificationDTO> notifications = notificationService.getNotificationsForUser(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUnreadNotifications() {
        Long utilisateurId = getCurrentUserId();
        List<NotificationDTO> notifications = notificationService.getUnreadNotificationsForUser(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        Long utilisateurId = getCurrentUserId();
        long count = notificationService.getUnreadCount(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
    }

    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<NotificationDTO>> getNotificationById(@PathVariable Long id) {
        NotificationDTO notification = notificationService.getNotificationById(id);
        
        Long utilisateurId = getCurrentUserId();
        if (!notification.getUtilisateurId().equals(utilisateurId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Accès non autorisé à cette notification"));
        }
        return ResponseEntity.ok(ApiResponse.success(notification));
    }

    
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<NotificationDTO>> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {
        NotificationDTO notification = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Notification créée avec succès", notification));
    }

    
    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(@PathVariable Long id) {
        
        NotificationDTO notification = notificationService.getNotificationById(id);
        Long utilisateurId = getCurrentUserId();
        if (!notification.getUtilisateurId().equals(utilisateurId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Accès non autorisé à cette notification"));
        }
        
        NotificationDTO updatedNotification = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marquée comme lue", updatedNotification));
    }

    
    @PatchMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        Long utilisateurId = getCurrentUserId();
        notificationService.markAllAsRead(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success("Toutes les notifications marquées comme lues", null));
    }

    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        
        NotificationDTO notification = notificationService.getNotificationById(id);
        Long utilisateurId = getCurrentUserId();
        if (!notification.getUtilisateurId().equals(utilisateurId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Accès non autorisé à cette notification"));
        }
        
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification supprimée", null));
    }

    
    @DeleteMapping("/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteReadNotifications() {
        Long utilisateurId = getCurrentUserId();
        notificationService.deleteReadNotifications(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success("Notifications lues supprimées", null));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
            .getId();
    }
}

