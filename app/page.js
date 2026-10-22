"use client";

import AdvisorsSection from "../components/home/AdvisorsSection";
import BlogSection from "../components/home/BlogSection";
import HelpSection from "../components/home/HelpSection";
import HeroSection from "../components/home/HeroSection";
import PropertyTypes from "../components/home/PropertyTypes";
import HeroProSection from "../components/home-pro/HeroProSection";
import RentListings from "../components/home-pro/RentListings";
import TopAgenciesSection from "../components/home-pro/top-agencies";
import ServicesSection from "../components/home-pro/ServicesSection";
import SuggestedSearches from "../components/home-pro/SuggestedSearches";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <>
        <HeroProSection />
        <RentListings />
        <TopAgenciesSection />
        <ServicesSection />
        <SuggestedSearches />
      </>
    );
  }

  return (
    <>
      <HeroSection />
      <HelpSection />
      <PropertyTypes />
      <AdvisorsSection />
      <BlogSection />
    </>
  );
}
