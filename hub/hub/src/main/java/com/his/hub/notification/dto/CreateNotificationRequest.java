package com.his.hub.notification.dto;

import com.his.hub.notification.entity.Notification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    
    @NotNull(message = "L'ID de l'utilisateur est requis")
    private Long utilisateurId;
    
    @NotBlank(message = "Le titre est requis")
    private String titre;
    
    private String message;
    
    private Notification.TypeNotification type = Notification.TypeNotification.INFO;
    
    private Notification.CategorieNotification categorie = Notification.CategorieNotification.SYSTEME;
    
    private Long referenceId;
    
    private String referenceType;
}

