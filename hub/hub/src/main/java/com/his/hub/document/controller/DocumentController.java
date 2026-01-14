package com.his.hub.document.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.document.dto.DocumentDTO;
import com.his.hub.document.dto.UploadDocumentRequest;
import com.his.hub.document.entity.Document;
import com.his.hub.document.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER')")
    public ResponseEntity<ApiResponse<DocumentDTO>> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestPart("request") UploadDocumentRequest request) {
        DocumentDTO document = documentService.uploadDocument(file, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Document uploadé avec succès", document));
    }

    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<DocumentDTO>> getDocumentById(@PathVariable Long id) {
        DocumentDTO document = documentService.getDocumentById(id);
        
        if (document.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(document.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(document));
    }

    
    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        
        Document documentEntity = documentService.getDocumentEntity(id);
        if (documentEntity.getPatient() != null) {
            patientAccessValidationService.validatePatientAccess(documentEntity.getPatient().getId());
        }

        try {
            Path filePath = Paths.get(documentEntity.getCheminFichier());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                throw new BusinessException("Fichier non trouvé sur le serveur");
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(documentEntity.getTypeMime()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + documentEntity.getNomFichier() + "\"")
                .body(resource);
        } catch (MalformedURLException e) {
            throw new BusinessException("Erreur lors du téléchargement du fichier");
        }
    }

    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<DocumentDTO>>> getDocumentsByPatient(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<DocumentDTO> documents = documentService.getDocumentsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    
    @GetMapping("/patient/{patientId}/categorie/{categorie}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<DocumentDTO>>> getDocumentsByPatientAndCategorie(
            @PathVariable Long patientId,
            @PathVariable Document.CategorieDocument categorie) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<DocumentDTO> documents = documentService.getDocumentsByPatientIdAndCategorie(patientId, categorie);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<DocumentDTO>>> getAllDocuments() {
        List<DocumentDTO> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(ApiResponse.success("Document supprimé avec succès", null));
    }
}

