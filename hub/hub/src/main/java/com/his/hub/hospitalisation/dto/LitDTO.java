package com.his.hub.hospitalisation.dto;

import com.his.hub.hospitalisation.entity.Lit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LitDTO {
    private Long id;
    private String numeroLit;
    private String service;
    private String chambre;
    private Lit.StatutLit statut;
    private String notes;
}

