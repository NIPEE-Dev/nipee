import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import useUploadSignature from '../../hooks/useUploadSignature';  

function SignaturePad({ documentId, toggleModal, onSuccess }) {
    const [url, setUrl] = useState('');
    const signRef = useRef(null);
    const { uploadSignature, loading, error, successMessage } = useUploadSignature();
    const navigate = useNavigate(); 

    const userProfile = JSON.parse(localStorage.getItem('profile'));
    const userRole = userProfile?.role || '';
    const type = userRole === "Empresa" ? "empresa" : userRole === "Escola" ? "escola" : "";
    const contractId = documentId; 

    const handleClear = () => {
        if (signRef.current) {
            signRef.current.clear();
        }
        setUrl('');
    };

    const handleGenerate = async () => {  
        if (!signRef.current || signRef.current.isEmpty()) {
            alert("Por favor, faça sua assinatura antes de enviar.");
            return;
        }

        const imageData = signRef.current.getTrimmedCanvas().toDataURL('image/png'); 
        setUrl(imageData);
    
        try {
            await uploadSignature(contractId, imageData, type); 
            if (onSuccess) {
                onSuccess(); 
            }
            setTimeout(() => {
                window.location.href = '/documents';
            }, 500);
        } catch (err) {
            console.error("Erro ao enviar a assinatura:", err);
        }
    };

    return (
        <div>
            <p style={{ marginBottom: '20px' }}>Faça a sua assinatura. A assinatura realizada aqui será adicionada ao protocolo.</p>
            <div style={{ border: "2px solid black", width: 500, height: 200 }}>
                <SignatureCanvas
                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                    ref={signRef}
                />
            </div>

            <br />
            <button style={buttonStyle2} onClick={handleClear}>Limpar</button>
            <button style={buttonStyle} onClick={handleGenerate} disabled={loading}>
                {loading ? "Enviando..." : "Assinar"}
            </button>

            <br /><br />
            {loading && <p>Enviando assinatura...</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

const buttonStyle = {
    height: "35px",
    width: "80px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
};

const buttonStyle2 = {
    height: "35px",
    width: "80px",
    backgroundColor: "gray",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
};

export default SignaturePad;
