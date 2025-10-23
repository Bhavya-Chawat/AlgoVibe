"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistrationForm from "@/components/register/RegistrationForm";
import Beams from "@/components/background/Beams";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Beams />

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-5xl">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue-400 to-teal-400">
                Register for AlgoVibe
              </h1>
              <p className="text-xl text-gray-400">
                Join the ultimate algorithmic visualization experience
              </p>
              <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent"></div>
            </div>

            {/* Registration Form */}
            <RegistrationForm />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
