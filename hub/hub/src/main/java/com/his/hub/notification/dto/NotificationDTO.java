package com.his.hub.notification.dto;

import com.his.hub.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    
    private Long id;
    private Long utilisateurId;
    private String titre;
    private String message;
    private Notification.TypeNotification type;
    private Notification.CategorieNotification categorie;
    private Boolean lu;
    private LocalDateTime dateLecture;
    private Long referenceId;
    private String referenceType;
    private LocalDateTime dateCreation;
}

