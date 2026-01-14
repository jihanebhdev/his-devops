export const groupByDayOfWeek = (data, dateField = 'dateHeure') => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const grouped = {
    Dim: 0,
    Lun: 0,
    Mar: 0,
    Mer: 0,
    Jeu: 0,
    Ven: 0,
    Sam: 0,
  };
  if (!Array.isArray(data)) {
    return Object.entries(grouped).map(([nom, value]) => ({ nom, value }));
  }
  data.forEach((item) => {
    if (item && item[dateField]) {
      try {
        const date = new Date(item[dateField]);
        if (!isNaN(date.getTime())) {
          const dayName = days[date.getDay()];
          grouped[dayName] = (grouped[dayName] || 0) + 1;
        }
      } catch (error) {
        console.warn('groupByDayOfWeek: Error parsing date', error);
      }
    }
  });
  return Object.entries(grouped).map(([nom, value]) => ({ nom, value }));
};
export const groupByMonth = (data, dateField = 'dateHeure') => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const grouped = {};
  if (!Array.isArray(data)) {
    console.warn('groupByMonth: data is not an array', data);
    return months.map((mois) => ({ mois, value: 0 }));
  }
  data.forEach((item) => {
    if (item && item[dateField]) {
      try {
        const date = new Date(item[dateField]);
        if (!isNaN(date.getTime())) {
          const monthIndex = date.getMonth();
          const monthName = months[monthIndex];
          grouped[monthName] = (grouped[monthName] || 0) + 1;
        }
      } catch (error) {
        console.warn('groupByMonth: Error parsing date', item[dateField], error);
      }
    }
  });
  return months.map((mois) => ({
    mois,
    value: grouped[mois] || 0,
  }));
};
export const groupByLast7Days = (data, dateField = 'dateHeure') => {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      value: 0,
    });
  }
  if (!Array.isArray(data)) {
    return days.map((d) => ({ nom: d.dayName, value: d.value }));
  }
  data.forEach((item) => {
    if (item && item[dateField]) {
      try {
        const itemDate = new Date(item[dateField]).toISOString().split('T')[0];
        const day = days.find((d) => d.date === itemDate);
        if (day) {
          day.value += 1;
        }
      } catch (error) {
        console.warn('groupByLast7Days: Error parsing date', error);
      }
    }
  });
  return days.map((d) => ({ nom: d.dayName, value: d.value }));
};
export const calculateVariation = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? '+100%' : '0%';
  const variation = ((current - previous) / previous) * 100;
  return variation >= 0 ? `+${variation.toFixed(0)}%` : `${variation.toFixed(0)}%`;
};
export const groupAppointmentsByDay = (appointments) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const today = new Date();
  const grouped = days.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});
  appointments?.forEach((appointment) => {
    if (appointment.dateHeure) {
      const date = new Date(appointment.dateHeure);
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Lundi = 0
        grouped[dayName] = (grouped[dayName] || 0) + 1;
      }
    }
  });
  return days.map((nom) => ({ nom, rendezvous: grouped[nom] || 0 }));
};
export const groupPatientsByDay = (patients) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const today = new Date();
  const grouped = days.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});
  patients?.forEach((patient) => {
    const dateField = patient.dateCreation || patient.dateInscription || patient.dateNaissance;
    if (dateField) {
      const date = new Date(dateField);
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        grouped[dayName] = (grouped[dayName] || 0) + 1;
      }
    }
  });
  return days.map((nom) => ({ nom, patients: grouped[nom] || 0 }));
};
export const combineActivityData = (appointments, patients, users = []) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const appointmentsByDay = groupAppointmentsByDay(appointments);
  const patientsByDay = groupPatientsByDay(patients);
  const usersByDay = groupUsersByDay(users);
  return days.map((nom) => ({
    nom,
    utilisateurs: usersByDay.find((d) => d.nom === nom)?.utilisateurs || 0,
    patients: patientsByDay.find((d) => d.nom === nom)?.patients || 0,
    rendezvous: appointmentsByDay.find((d) => d.nom === nom)?.rendezvous || 0,
  }));
};
export const groupUsersByDay = (users) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const today = new Date();
  const grouped = days.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});
  users?.forEach((user) => {
    const dateField = user.dateCreation || user.dateInscription;
    if (dateField) {
      const date = new Date(dateField);
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        grouped[dayName] = (grouped[dayName] || 0) + 1;
      }
    }
  });
  return days.map((nom) => ({ nom, utilisateurs: grouped[nom] || 0 }));
};
export const groupConsultationsByMonth = (consultations, hospitalisations) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const consultationsByMonth = {};
  const hospitalisationsByMonth = {};
  consultations?.forEach((consultation) => {
    if (consultation.dateHeure) {
      const date = new Date(consultation.dateHeure);
      const monthIndex = date.getMonth();
      if (monthIndex < 6) {
        const monthName = months[monthIndex];
        consultationsByMonth[monthName] = (consultationsByMonth[monthName] || 0) + 1;
      }
    }
  });
  hospitalisations?.forEach((hospitalisation) => {
    if (hospitalisation.dateAdmission) {
      const date = new Date(hospitalisation.dateAdmission);
      const monthIndex = date.getMonth();
      if (monthIndex < 6) {
        const monthName = months[monthIndex];
        hospitalisationsByMonth[monthName] = (hospitalisationsByMonth[monthName] || 0) + 1;
      }
    }
  });
  return months.map((mois) => ({
    mois,
    consultations: consultationsByMonth[mois] || 0,
    hospitalisations: hospitalisationsByMonth[mois] || 0,
  }));
};
export const calculateRepartitionData = (patients, users, appointments, consultations) => {
  const patientsCount = patients?.length || 0;
  const usersCount = users?.length || 0;
  const appointmentsCount = appointments?.length || 0;
  const consultationsCount = consultations?.length || 0;
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const total = patientsCount + usersCount + appointmentsCount + consultationsCount;
  return days.map((nom, index) => {
    const factor = 0.8 + (Math.sin(index * 0.5) * 0.2); // Variation légère pour le graphique
    return {
      nom,
      patients: Math.round(patientsCount * factor / 7),
      utilisateurs: Math.round(usersCount * factor / 7),
      rendezvous: Math.round(appointmentsCount * factor / 7),
      consultations: Math.round(consultationsCount * factor / 7),
    };
  });
};
export const calculateTrendData = (data, dateField = 'dateHeure', countField = null) => {
  if (!data || data.length === 0) {
    return Array.from({ length: 30 }, () => ({ value: 0 }));
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const trendData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    trendData.push({
      date: date.toISOString().split('T')[0],
      value: 0,
    });
  }
  data.forEach((item) => {
    const itemDate = item[dateField];
    if (itemDate) {
      const date = new Date(itemDate);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = trendData.find((d) => d.date === dateStr);
      if (dayData) {
        if (countField) {
          dayData.value += item[countField] || 0;
        } else {
          dayData.value += 1;
        }
      }
    }
  });
  return trendData.map((d) => ({ value: d.value }));
};
export const calculateTrendDataFromCount = (total, days = 30) => {
  if (total === 0) {
    return Array.from({ length: days }, () => ({ value: 0 }));
  }
  const trendData = [];
  const baseValue = total / days;
  for (let i = 0; i < days; i++) {
    const variation = Math.sin((i / days) * Math.PI * 2) * 0.3;
    const value = Math.max(0, Math.round(baseValue * (1 + variation)));
    trendData.push({ value });
  }
  return trendData;
};
