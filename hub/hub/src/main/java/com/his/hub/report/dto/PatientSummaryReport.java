package com.his.hub.report.dto;

import com.his.hub.consultation.dto.ConsultationDTO;
import com.his.hub.patient.dto.PatientDTO;
import com.his.hub.rendezvous.dto.RendezVousDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientSummaryReport {
    
    private LocalDateTime generatedAt;
    private String generatedBy;
    
    private PatientDTO patient;
    private String groupeSanguin;
    private String rhesus;
    private String antecedentsMedicaux;
    private String allergies;
    
    private List<ConsultationDTO> recentConsultations;
    private List<RendezVousDTO> upcomingAppointments;
    
    private int totalConsultations;
    private int totalHospitalisations;
    private int totalDocuments;
}

