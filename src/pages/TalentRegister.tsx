
import React from 'react';
import TalentRegistrationForm from '@/components/TalentRegistrationForm';

const TalentRegister = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bergabung Sebagai Talent
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Daftarkan diri Anda sebagai talent Temanly dan mulai mendapatkan penghasilan 
            dengan menjadi teman bagi orang-orang yang membutuhkan.
          </p>
        </div>
        
        <TalentRegistrationForm />
        
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Sudah punya akun? {' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TalentRegister;
