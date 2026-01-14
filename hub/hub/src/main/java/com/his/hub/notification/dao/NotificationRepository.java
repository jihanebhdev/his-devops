package com.his.hub.notification.dao;

import com.his.hub.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUtilisateurIdOrderByDateCreationDesc(Long utilisateurId);
    
    List<Notification> findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(Long utilisateurId);
    
    long countByUtilisateurIdAndLuFalse(Long utilisateurId);
    
    List<Notification> findByUtilisateurIdAndCategorieOrderByDateCreationDesc(
        Long utilisateurId, 
        Notification.CategorieNotification categorie
    );
    
    List<Notification> findByUtilisateurIdAndDateCreationAfterOrderByDateCreationDesc(
        Long utilisateurId, 
        LocalDateTime date
    );
    
    void deleteByUtilisateurIdAndLuTrue(Long utilisateurId);
}

