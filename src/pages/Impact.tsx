import { Layout } from '@/components/Layout';
import { 
  TrendingUp, 
  Store, 
  Factory, 
  Sprout,
  Leaf,
  DollarSign,
  Clock,
  BarChart3,
  Recycle,
  Globe
} from 'lucide-react';

const Impact = () => {
  const stakeholderBenefits = [
    {
      icon: Store,
      title: 'For Retailers',
      color: 'bg-blue-500',
      benefits: [
        { title: 'Reduced Stock-outs', description: 'Never miss a sale due to unavailable products' },
        { title: 'Lower Inventory Costs', description: 'Minimize capital locked in excess stock' },
        { title: 'Better Cash Flow', description: 'Optimize purchasing decisions' },
        { title: 'Competitive Edge', description: 'Data-driven advantage over competitors' },
        { title: 'Time Savings', description: 'Automate manual forecasting tasks' },
      ],
    },
    {
      icon: Factory,
      title: 'For Manufacturers',
      color: 'bg-amber-500',
      benefits: [
        { title: 'Demand Visibility', description: 'Better understanding of market needs' },
        { title: 'Production Planning', description: 'Align manufacturing with actual demand' },
        { title: 'Reduced Returns', description: 'Fewer expired products returned' },
        { title: 'Supply Chain Efficiency', description: 'Optimized distribution networks' },
        { title: 'Customer Insights', description: 'Regional demand patterns revealed' },
      ],
    },
    {
      icon: Sprout,
      title: 'For Farmers (Indirect)',
      color: 'bg-green-500',
      benefits: [
        { title: 'Reliable Supply', description: 'Essential inputs available when needed' },
        { title: 'Better Prices', description: 'Reduced supply chain inefficiencies' },
        { title: 'Timely Access', description: 'Products available during critical periods' },
        { title: 'Quality Assurance', description: 'Fresher products with better rotation' },
        { title: 'Farm Productivity', description: 'No delays in crop treatment cycles' },
      ],
    },
  ];

  const environmentalBenefits = [
    {
      icon: Recycle,
      title: 'Waste Reduction',
      value: '25%',
      description: 'Less agricultural input waste due to better inventory management',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      value: 'High',
      description: 'Supporting sustainable agriculture through optimized resource use',
    },
    {
      icon: Globe,
      title: 'Environmental Impact',
      value: 'Positive',
      description: 'Reduced disposal of expired chemicals and fertilizers',
    },
  ];

  const economicImpact = [
    { icon: DollarSign, label: 'Cost Savings', value: '15-20%', description: 'Reduction in inventory costs' },
    { icon: Clock, label: 'Time Efficiency', value: '40%', description: 'Faster ordering decisions' },
    { icon: BarChart3, label: 'Sales Increase', value: '10-15%', description: 'From reduced stock-outs' },
    { icon: TrendingUp, label: 'ROI', value: '3-5x', description: 'Return on system investment' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 mb-6">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Impact & Benefits</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Creating Real Value
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Discover how our AI-powered system creates positive impact across 
              the agricultural supply chain ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Economic Impact Stats */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {economicImpact.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center text-primary-foreground">
                  <Icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <div className="text-3xl md:text-4xl font-display font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="font-medium mb-1">{stat.label}</div>
                  <div className="text-sm opacity-70">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stakeholder Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Benefits by Stakeholder
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system creates value for everyone in the agricultural input supply chain.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {stakeholderBenefits.map((stakeholder, index) => {
              const Icon = stakeholder.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <div className={`${stakeholder.color} p-6 text-white`}>
                    <Icon className="h-10 w-10 mb-4" />
                    <h3 className="text-xl font-display font-bold">{stakeholder.title}</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      {stakeholder.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{benefit.title}</p>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Environmental & Sustainability */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">Sustainability</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Environmental Benefits
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Optimized inventory management contributes to sustainable agriculture and environmental protection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {environmentalBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-card border border-border text-center"
                >
                  <div className="p-4 rounded-full bg-success/10 text-success w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-display font-bold text-success mb-2">
                    {benefit.value}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                UN Sustainable Development Goals
              </h2>
              <p className="text-muted-foreground">
                Our system aligns with multiple SDGs for sustainable agriculture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-3xl font-bold text-amber-600 mb-2">SDG 2</div>
                <h4 className="font-semibold text-foreground mb-2">Zero Hunger</h4>
                <p className="text-sm text-muted-foreground">
                  Supporting food security through reliable agricultural input supply.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="text-3xl font-bold text-red-600 mb-2">SDG 12</div>
                <h4 className="font-semibold text-foreground mb-2">Responsible Consumption</h4>
                <p className="text-sm text-muted-foreground">
                  Reducing waste through optimized inventory management.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">SDG 9</div>
                <h4 className="font-semibold text-foreground mb-2">Industry & Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Leveraging AI for sustainable industrial practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;
