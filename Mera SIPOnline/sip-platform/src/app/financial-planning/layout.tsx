import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Free Financial Planning | Trustner Financial Health Assessment',
  description:
    'Get your personalized Financial Health Score (0-900) with CFP-grade analysis. Free comprehensive assessment covering retirement, insurance, investments, and goals. Powered by Trustner AI.',
  path: '/financial-planning',
  keywords: [
    'financial planning',
    'financial health score',
    'retirement planning',
    'insurance gap',
    'investment planning',
    'free financial assessment',
    'CFP',
    'Trustner',
  ],
});

export default function FinancialPlanningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
