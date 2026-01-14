package com.his.hub.notification.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.notification.dao.NotificationRepository;
import com.his.hub.notification.dto.CreateNotificationRequest;
import com.his.hub.notification.dto.NotificationDTO;
import com.his.hub.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    
    public NotificationDTO createNotification(CreateNotificationRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Notification notification = new Notification();
        notification.setUtilisateur(utilisateur);
        notification.setTitre(request.getTitre());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType() != null ? request.getType() : Notification.TypeNotification.INFO);
        notification.setCategorie(request.getCategorie() != null ? request.getCategorie() : Notification.CategorieNotification.SYSTEME);
        notification.setReferenceId(request.getReferenceId());
        notification.setReferenceType(request.getReferenceType());
        notification.setLu(false);

        Notification saved = notificationRepository.save(notification);
        return toDTO(saved);
    }

    
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsForUser(Long utilisateurId) {
        return notificationRepository.findByUtilisateurIdOrderByDateCreationDesc(utilisateurId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotificationsForUser(Long utilisateurId) {
        return notificationRepository.findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(utilisateurId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public long getUnreadCount(Long utilisateurId) {
        return notificationRepository.countByUtilisateurIdAndLuFalse(utilisateurId);
    }

    
    public NotificationDTO markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée"));

        notification.setLu(true);
        notification.setDateLecture(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);
        return toDTO(saved);
    }

    
    public void markAllAsRead(Long utilisateurId) {
        List<Notification> unreadNotifications = notificationRepository
            .findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(utilisateurId);

        LocalDateTime now = LocalDateTime.now();
        unreadNotifications.forEach(n -> {
            n.setLu(true);
            n.setDateLecture(now);
        });

        notificationRepository.saveAll(unreadNotifications);
    }

    
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée"));
        notificationRepository.delete(notification);
    }

    
    public void deleteReadNotifications(Long utilisateurId) {
        notificationRepository.deleteByUtilisateurIdAndLuTrue(utilisateurId);
    }

    
    @Transactional(readOnly = true)
    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée"));
        return toDTO(notification);
    }

    private NotificationDTO toDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUtilisateurId(notification.getUtilisateur().getId());
        dto.setTitre(notification.getTitre());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setCategorie(notification.getCategorie());
        dto.setLu(notification.getLu());
        dto.setDateLecture(notification.getDateLecture());
        dto.setReferenceId(notification.getReferenceId());
        dto.setReferenceType(notification.getReferenceType());
        dto.setDateCreation(notification.getDateCreation());
        return dto;
    }
}

