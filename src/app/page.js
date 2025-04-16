"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  CalendarCheck,
  UserRound,
  Clock,
  ChevronRight,
  Star,
  Phone,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
                <span className="text-blue-700">Healthcare</span> Made Simple
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Access quality healthcare services with convenience and
                efficiency. Book appointments, consult with doctors, and manage
                your health records all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/appointments"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                >
                  Book Appointment
                </Link>
                <Link
                  href="/services"
                  className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 transition-colors duration-300 text-center"
                >
                  Our Services
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-10"></div>
                <div className="absolute -top-6 -right-6 w-64 h-64 bg-blue-100 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-200 rounded-full"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <Stethoscope className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Online Consultation
                        </h3>
                        <p className="text-sm text-gray-500">
                          Talk to a doctor now
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-100 rounded-full mr-4">
                        <CalendarCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Easy Scheduling
                        </h3>
                        <p className="text-sm text-gray-500">
                          Book appointments easily
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-full mr-4">
                        <UserRound className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Personal Health Records
                        </h3>
                        <p className="text-sm text-gray-500">
                          All in one place
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-blue-700">Medi</span>
              <span className="text-gray-600">Care</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare solutions designed to make
              your experience seamless and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
              <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                24/7 Availability
              </h3>
              <p className="text-gray-600">
                Access healthcare services anytime, anywhere with our
                round-the-clock service availability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
              <div className="p-3 bg-green-100 rounded-lg inline-flex mb-4">
                <UserRound className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Expert Doctors
              </h3>
              <p className="text-gray-600">
                Consult with highly qualified and experienced medical
                professionals specializing in various fields.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
              <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Online Consultations
              </h3>
              <p className="text-gray-600">
                Get medical advice and consultations from the comfort of your
                home through video calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg shadow-sm p-1">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "patients"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("patients")}
              >
                For Patients
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "doctors"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("doctors")}
              >
                For Doctors
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "clinics"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("clinics")}
              >
                For Clinics
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            {activeTab === "patients" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Patient Services
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Online appointment booking with specialists
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Virtual consultations from home
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Digital health records management
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Medication reminders and tracking
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      24/7 emergency support
                    </li>
                  </ul>
                  <Link
                    href="/patient-services"
                    className="inline-flex items-center mt-6 text-blue-600 font-medium hover:text-blue-800"
                  >
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                      <UserRound className="w-12 h-12 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Patient Portal
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Access all your health services in one place
                    </p>
                    <Link
                      href="/patient-login"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "doctors" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Doctor Services
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Patient management system
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Electronic prescription service
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Online consultation platform
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Scheduling and appointment management
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Access to medical resources
                    </li>
                  </ul>
                  <Link
                    href="/doctor-services"
                    className="inline-flex items-center mt-6 text-blue-600 font-medium hover:text-blue-800"
                  >
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="bg-green-50 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                      <Stethoscope className="w-12 h-12 text-green-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Doctor Dashboard
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Manage your practice efficiently
                    </p>
                    <Link
                      href="/doctor-login"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "clinics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Clinic Services
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Complete clinic management system
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Staff scheduling and management
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Inventory and equipment tracking
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Billing and insurance processing
                    </li>
                    <li className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      Patient flow optimization
                    </li>
                  </ul>
                  <Link
                    href="/clinic-services"
                    className="inline-flex items-center mt-6 text-blue-600 font-medium hover:text-blue-800"
                  >
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                      <CalendarCheck className="w-12 h-12 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Clinic Management
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Streamline your healthcare facility
                    </p>
                    <Link
                      href="/clinic-login"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Feedback from patients and healthcare providers who use our
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "MediCare has transformed how I manage my health. Booking
                appointments is so simple, and the virtual consultations save me
                so much time."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">SW</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Sarah Wilson</h4>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a doctor, this platform helps me stay organized and connect
                with my patients more efficiently. The user interface is
                intuitive and saves me hours each week."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">DK</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Dr. Kevin Mills</h4>
                  <p className="text-sm text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Our clinic has seen a 30% increase in efficiency since
                implementing MediCare. The scheduling system and patient records
                management are excellent."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">RL</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Rebecca Lee</h4>
                  <p className="text-sm text-gray-500">Clinic Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who are already
            benefiting from our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              href="/contact"
              className="bg-transparent hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg border border-white transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  <span className="text-blue-400">Medi</span>
                  <span>Care</span>
                </h3>
              </Link>
              <p className="text-sm">
                Making healthcare accessible, efficient, and personalized for
                everyone.
              </p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-blue-300 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/appointments"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Health Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">For Professionals</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/doctors/join"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Join as Doctor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clinics/register"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Register Clinic
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partner"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Partnership
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="hover:text-blue-300 transition-colors"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (800) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>support@medicare.com</span>
                </li>
              </ul>
              <div className="mt-4 flex space-x-3">
                {/* Social media icons would go here */}
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  {/* Facebook icon */}
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  {/* Twitter icon */}
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <span className="sr-only">YouTube</span>
                  {/* YouTube icon */}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} MediCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
