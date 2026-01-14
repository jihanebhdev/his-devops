package com.his.hub.document.dao;

import com.his.hub.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByPatientIdAndActifTrueOrderByDateCreationDesc(Long patientId);
    
    List<Document> findByPatientIdAndCategorieAndActifTrueOrderByDateCreationDesc(
        Long patientId, 
        Document.CategorieDocument categorie
    );
    
    List<Document> findByUploadedByIdOrderByDateCreationDesc(Long uploadedById);
    
    List<Document> findByActifTrueOrderByDateCreationDesc();
    
    long countByPatientId(Long patientId);
}

