import React from "react";
import { BeautifulLoader, LoadingScreen } from "./index";

const LoadingDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Beautiful Loading Components
          </h1>
          <p className="text-muted-foreground text-lg">
            Slick animations and modern loading states for your app
          </p>
        </div>

        {/* BeautifulLoader Variants */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">
            BeautifulLoader Variants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Default */}
            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Default</h3>
              <BeautifulLoader size="md" text="Loading..." variant="default" />
            </div>

            {/* Primary */}
            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Primary</h3>
              <BeautifulLoader size="md" text="Loading..." variant="primary" />
            </div>

            {/* Secondary */}
            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Secondary</h3>
              <BeautifulLoader
                size="md"
                text="Loading..."
                variant="secondary"
              />
            </div>

            {/* Gradient */}
            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Gradient</h3>
              <BeautifulLoader size="md" text="Loading..." variant="gradient" />
            </div>
          </div>

          {/* Different Sizes */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Different Sizes</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Small</p>
                <BeautifulLoader size="sm" variant="primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Medium</p>
                <BeautifulLoader size="md" variant="primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Large</p>
                <BeautifulLoader size="lg" variant="primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Extra Large</p>
                <BeautifulLoader size="xl" variant="primary" />
              </div>
            </div>
          </div>

          {/* With Logo */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">With Logo</h3>
            <div className="flex justify-center">
              <BeautifulLoader
                size="lg"
                text="Initializing..."
                variant="gradient"
                showLogo={true}
              />
            </div>
          </div>
        </section>

        {/* LoadingScreen Preview */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">
            LoadingScreen Preview
          </h2>
          <div className="bg-card rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-6">
              This is how the full-screen loading looks (scaled down)
            </p>
            <div className="relative h-64 bg-gradient-to-br from-background via-background to-muted/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="scale-50">
                  <BeautifulLoader
                    size="xl"
                    text="Initializing Visitwise..."
                    variant="gradient"
                    showLogo={true}
                    className="animate-fade-in"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Animation Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Fade In</h3>
              <div className="animate-fade-in">
                <BeautifulLoader size="md" variant="primary" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Shimmer Effect</h3>
              <div className="animate-shimmer rounded-lg p-4">
                <BeautifulLoader size="md" variant="gradient" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 text-center space-y-4">
              <h3 className="font-medium">Pulse Glow</h3>
              <div className="animate-pulse-glow rounded-lg p-4">
                <BeautifulLoader size="md" variant="primary" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoadingDemo;
