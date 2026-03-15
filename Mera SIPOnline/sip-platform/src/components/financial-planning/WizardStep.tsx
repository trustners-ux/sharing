'use client';

import { useEffect, useState } from 'react';

interface WizardStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function WizardStep({ title, description, icon, children }: WizardStepProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}
