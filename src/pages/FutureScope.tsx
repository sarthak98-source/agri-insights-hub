import { Layout } from '@/components/Layout';
import { 
  AlertCircle, 
  Lightbulb, 
  Rocket,
  Cloud,
  Smartphone,
  Users,
  Brain,
  Wifi,
  BarChart3,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FutureScope = () => {
  const limitations = [
    {
      icon: BarChart3,
      title: 'Sample Data Usage',
      description: 'Current hackathon demo uses simulated data. Production deployment would require real historical sales data for accurate predictions.',
    },
    {
      icon: Cloud,
      title: 'Weather Integration',
      description: 'Limited weather data accuracy. Future versions could integrate real-time weather APIs for better seasonal forecasting.',
    },
    {
      icon: MapPin,
      title: 'Regional Scope',
      description: 'Currently designed for single-location retailers. Multi-location support would require additional architecture.',
    },
    {
      icon: Users,
      title: 'User Training',
      description: 'Requires basic digital literacy. Onboarding support needed for rural retailers with limited tech exposure.',
    },
  ];

  const futureEnhancements = [
    {
      icon: Wifi,
      title: 'IoT Sensor Integration',
      description: 'Connect warehouse sensors for real-time inventory tracking, temperature monitoring, and automated stock counting.',
      timeline: 'Phase 1',
      status: 'Planned',
    },
    {
      icon: Users,
      title: 'Government Dashboard',
      description: 'Aggregated view for agriculture departments to monitor regional supply-demand patterns and plan interventions.',
      timeline: 'Phase 2',
      status: 'Concept',
    },
    {
      icon: Smartphone,
      title: 'Farmer Mobile App',
      description: 'Allow farmers to input their demand forecasts, creating bottom-up demand signals for better predictions.',
      timeline: 'Phase 2',
      status: 'Concept',
    },
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Incorporate deep learning (LSTM, Transformer) for complex pattern recognition and long-range forecasting.',
      timeline: 'Phase 3',
      status: 'Research',
    },
    {
      icon: Cloud,
      title: 'Weather API Integration',
      description: 'Real-time weather data integration for climate-adjusted demand predictions.',
      timeline: 'Phase 1',
      status: 'Planned',
    },
    {
      icon: MapPin,
      title: 'Multi-Location Support',
      description: 'Expand to support retail chains with multiple locations and centralized inventory management.',
      timeline: 'Phase 2',
      status: 'Concept',
    },
  ];

  const researchAreas = [
    'Reinforcement learning for dynamic pricing',
    'Natural language processing for market intelligence',
    'Computer vision for product quality assessment',
    'Blockchain for supply chain transparency',
    'Edge computing for offline predictions',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 mb-6">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">Future Scope</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Limitations & Future Vision
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Honest assessment of current limitations and our roadmap for 
              evolving this system into a comprehensive agricultural supply chain solution.
            </p>
          </div>
        </div>
      </section>

      {/* Current Limitations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Transparency</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Current Limitations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in honest communication about what our current prototype can and cannot do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {limitations.map((limitation, index) => {
              const Icon = limitation.icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-card border border-border border-l-4 border-l-warning"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-warning/10 text-warning shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{limitation.title}</h3>
                      <p className="text-sm text-muted-foreground">{limitation.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future Enhancements */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Rocket className="h-4 w-4" />
              <span className="text-sm font-medium">Roadmap</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Future Enhancements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our vision for evolving this prototype into a comprehensive solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureEnhancements.map((enhancement, index) => {
              const Icon = enhancement.icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{enhancement.timeline}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        enhancement.status === 'Planned' 
                          ? 'bg-success/10 text-success'
                          : enhancement.status === 'Concept'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {enhancement.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{enhancement.title}</h3>
                  <p className="text-sm text-muted-foreground">{enhancement.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 mb-4">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">Research</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                  Emerging Research Areas
                </h2>
                <p className="text-muted-foreground mb-8">
                  Active exploration of cutting-edge technologies that could further 
                  enhance agricultural supply chain optimization.
                </p>
                
                <ul className="space-y-3">
                  {researchAreas.map((area, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground">
                <h3 className="text-2xl font-display font-bold mb-4">
                  Vision Statement
                </h3>
                <p className="opacity-90 mb-6">
                  "To become the leading AI-powered platform for agricultural supply chain 
                  optimization, connecting retailers, manufacturers, and farmers in a 
                  sustainable ecosystem that ensures no input shortage disrupts farming 
                  and no waste harms the environment."
                </p>
                <div className="text-sm opacity-70">
                  — Smart Agri-Input Inventory System Team
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Experience the Demo
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            See the current capabilities of our system and imagine what's possible with future enhancements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="hero" size="lg">
                <Rocket className="h-5 w-5" />
                Try Dashboard
              </Button>
            </Link>
            <Link to="/technology">
              <Button variant="outline" size="lg">
                View Technology
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FutureScope;
