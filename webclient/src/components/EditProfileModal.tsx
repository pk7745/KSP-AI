import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Save, User as UserIcon, Mail, Phone, Globe, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './EditProfileModal.css';

interface EditProfileModalProps {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
    language: user?.language || i18n.language || 'en'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      language: formData.language as 'en' | 'kn'
    });
    
    if (formData.language !== i18n.language) {
      i18n.changeLanguage(formData.language);
    }
    
    onClose();
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content wireframe-box registration-mark animate-fade-in">
        <div className="modal-header">
          <h3 className="modal-title">Edit Officer Profile</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>FULL NAME</label>
            <div className="input-with-icon">
              <UserIcon size={16} className="input-icon" />
              <input 
                type="text" 
                name="name"
                className="input-wireframe" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>DESIGNATION (ER-Mapped)</label>
            <div className="input-with-icon">
              <Briefcase size={16} className="input-icon" />
              <input 
                type="text" 
                name="designation"
                className="input-wireframe" 
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                name="email"
                className="input-wireframe" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>PHONE NUMBER</label>
            <div className="input-with-icon">
              <Phone size={16} className="input-icon" />
              <input 
                type="tel" 
                name="phone"
                className="input-wireframe" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>INTERFACE LANGUAGE</label>
            <div className="input-with-icon">
              <Globe size={16} className="input-icon" />
              <select 
                name="language" 
                className="input-wireframe select-wireframe"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer mt-md">
            <button type="button" className="btn btn-ghost" onClick={onClose}>CANCEL</button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} className="mr-xs" /> SAVE CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
