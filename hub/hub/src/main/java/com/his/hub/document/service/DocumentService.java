package com.his.hub.document.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.document.dao.DocumentRepository;
import com.his.hub.document.dto.DocumentDTO;
import com.his.hub.document.dto.UploadDocumentRequest;
import com.his.hub.document.entity.Document;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.entity.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Value("${app.document.upload-dir:./uploads}")
    private String uploadDir;

    
    public DocumentDTO uploadDocument(MultipartFile file, UploadDocumentRequest request) {
        if (file.isEmpty()) {
            throw new BusinessException("Le fichier est vide");
        }

        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Utilisateur uploadedBy = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        
        Patient patient = null;
        if (request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé"));
        }

        
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        String uniqueFilename = UUID.randomUUID().toString() + "_" + 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + extension;

        
        String contentType = file.getContentType();
        Document.TypeDocument typeDocument = determineDocumentType(contentType);

        
        String cheminFichier;
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            cheminFichier = filePath.toString();
        } catch (IOException e) {
            throw new BusinessException("Erreur lors de la sauvegarde du fichier: " + e.getMessage());
        }

        
        Document document = new Document();
        document.setNom(request.getNom());
        document.setNomFichier(originalFilename);
        document.setTypeMime(contentType);
        document.setTaille(file.getSize());
        document.setType(typeDocument);
        document.setCategorie(request.getCategorie() != null ? request.getCategorie() : Document.CategorieDocument.GENERAL);
        document.setDescription(request.getDescription());
        document.setPatient(patient);
        document.setUploadedBy(uploadedBy);
        document.setCheminFichier(cheminFichier);
        document.setActif(true);

        Document saved = documentRepository.save(document);
        return toDTO(saved);
    }

    
    @Transactional(readOnly = true)
    public DocumentDTO getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé"));
        return toDTO(document);
    }

    
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByPatientId(Long patientId) {
        return documentRepository.findByPatientIdAndActifTrueOrderByDateCreationDesc(patientId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByPatientIdAndCategorie(Long patientId, Document.CategorieDocument categorie) {
        return documentRepository.findByPatientIdAndCategorieAndActifTrueOrderByDateCreationDesc(patientId, categorie)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public List<DocumentDTO> getAllDocuments() {
        return documentRepository.findByActifTrueOrderByDateCreationDesc()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public String getDocumentFilePath(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé"));
        return document.getCheminFichier();
    }

    
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé"));
        document.setActif(false);
        documentRepository.save(document);
    }

    
    @Transactional(readOnly = true)
    public Document getDocumentEntity(Long id) {
        return documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé"));
    }

    private Document.TypeDocument determineDocumentType(String contentType) {
        if (contentType == null) return Document.TypeDocument.AUTRE;
        
        if (contentType.equals("application/pdf")) {
            return Document.TypeDocument.PDF;
        } else if (contentType.startsWith("image/")) {
            return Document.TypeDocument.IMAGE;
        } else if (contentType.equals("application/msword") || 
                   contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            return Document.TypeDocument.WORD;
        } else if (contentType.equals("application/vnd.ms-excel") ||
                   contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            return Document.TypeDocument.EXCEL;
        } else if (contentType.equals("application/dicom")) {
            return Document.TypeDocument.DICOM;
        }
        return Document.TypeDocument.AUTRE;
    }

    private DocumentDTO toDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setNom(document.getNom());
        dto.setNomFichier(document.getNomFichier());
        dto.setTypeMime(document.getTypeMime());
        dto.setTaille(document.getTaille());
        dto.setType(document.getType());
        dto.setCategorie(document.getCategorie());
        dto.setDescription(document.getDescription());
        
        if (document.getPatient() != null) {
            dto.setPatientId(document.getPatient().getId());
            dto.setPatientNom(document.getPatient().getNom());
            dto.setPatientPrenom(document.getPatient().getPrenom());
        }
        
        if (document.getUploadedBy() != null) {
            dto.setUploadedById(document.getUploadedBy().getId());
            dto.setUploadedByUsername(document.getUploadedBy().getUsername());
        }
        
        dto.setDownloadUrl("/api/documents/" + document.getId() + "/download");
        dto.setDateCreation(document.getDateCreation());
        dto.setDateModification(document.getDateModification());
        return dto;
    }
}

