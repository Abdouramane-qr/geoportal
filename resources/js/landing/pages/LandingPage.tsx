import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import Footer from '@/landing/components/layout/Footer';
import Navbar from '@/landing/components/layout/Navbar';

const Hero = lazy(() => import('@/landing/components/landing/Hero'));
const MobileAppSection = lazy(() => import('@/landing/components/landing/MobileAppSection'));
const Features = lazy(() => import('@/landing/components/landing/Features'));
const UseCases = lazy(() => import('@/landing/components/landing/UseCases'));
const Credibility = lazy(() => import('@/landing/components/landing/Credibility'));
const CTASection = lazy(() => import('@/landing/components/landing/CTASection'));

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Head title="LandSense Hub — SIG agricole institutionnel">
        <meta
          name="description"
          content="Plateforme SIG agricole pour institutions, ONG et collectivités. Cartographie fiable, validation scientifique, audit."
        />
      </Head>

      <Navbar />

      <Suspense fallback={<div className="h-16" />}>
        <Hero />
      </Suspense>

      <div id="mobile-app">
        <Suspense fallback={<div className="h-16" />}>
          <MobileAppSection />
        </Suspense>
      </div>

      <div id="features">
        <Suspense fallback={<div className="h-16" />}>
          <Features />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-16" />}>
        <UseCases />
      </Suspense>

      <Suspense fallback={<div className="h-16" />}>
        <Credibility />
      </Suspense>

      <Suspense fallback={<div className="h-16" />}>
        <CTASection />
      </Suspense>

      <Footer />
    </main>
  );
}
