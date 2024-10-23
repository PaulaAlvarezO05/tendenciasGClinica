import axios from 'axios'

const clinicaApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
})

clinicaApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Métodos GET(Read)
export const getAppointments = () => {
    return clinicaApi.get('/appointments/')
}

export const getPatients = () => {
    return clinicaApi.get('/patients/')
}

export const getUsers = () => { 
    return clinicaApi.get('/users/')
}

export const getMedicos = () => {
    return clinicaApi.get('/users/')
}

export const getConsultationType = () => {
    return clinicaApi.get('/consultationType/')
}

export const getRol = () => {
    return clinicaApi.get('/roles/')
} 

export const getMedicalSpecialties = () => {
    return clinicaApi.get('/medicalSpecialties/')
}

export const getMedicationInventory = () => {
    return clinicaApi.get('/medicationInventory/')
} 

// Métodos POST(Create)
export const addPatient = async (patientData) => {
    try {
        const response = await clinicaApi.post('/patients/', patientData);
        return response.data; 
    } catch (error) {
        console.error('Error al agregar el paciente:', error);
        throw error;
    }
};

export const addAppointment = async (appointmentData) => {
    try {
        const response = await clinicaApi.post('/appointments/', appointmentData);
        return response.data;
    } catch (error) {
        console.error('Error al agendar la cita:', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await clinicaApi.post('/users/', userData);
        return response.data;
    } catch (error) {
        console.error('Error al registar el usuario:', error);
        throw error;
    }
};

export const addPrescription = async (prescriptionData) => {
    try {
        const response = await clinicaApi.post('/prescriptions/', prescriptionData);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la prescripción:', error);
        throw error;
    }
};

export const addMedicalRecord = async (medicalRecordData) => {
    try {
        const response = await clinicaApi.post('/medicalRecords/', medicalRecordData);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la historia clínica:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await clinicaApi.post('/token/', credentials);
        return response.data.access;
    } catch (error) {
        console.error("Error en el inicio de sesión:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getUser = async (id) => {
    const response = await clinicaApi.get(`/users/${id}/`)
    return response.data
}

// Métodos PUT(Update)
export const updatePatient = async (id, patientData) => {
    try {
        const response = await clinicaApi.put(`/patients/${id}/`, patientData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el paciente:', error.response?.data || error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await clinicaApi.put(`/users/${id}/`, userData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error.response?.data || error);
        throw error;
    }
};

export const updateAppointment = async (id, updatedData) => {
    console.log("updatedData", updatedData)
    try {
        const response = await clinicaApi.put(`/appointments/${id}/`, updatedData);
        
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la cita:', error.response?.data || error);
        throw error;
    }
}

// Métodos DELETE(Delete)
export const deletePatient = async (id) => {
    try {
        const response = await clinicaApi.delete(`/patients/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await clinicaApi.delete(`/users/${id}/`);
        return response.data; 
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};





