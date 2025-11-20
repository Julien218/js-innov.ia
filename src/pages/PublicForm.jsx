import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function PublicForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  const [formValues, setFormValues] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading } = useQuery({
    queryKey: ['customForm', slug],
    queryFn: async () => {
      const forms = await base44.entities.CustomForm.filter({ slug });
      return forms[0];
    },
    enabled: !!slug
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.FormSubmission.create(data);
      if (form.notification_email) {
        await base44.integrations.Core.SendEmail({
          to: form.notification_email,
          subject: `Nouvelle soumission: ${form.name}`,
          body: `Nouvelle soumission reçue:\n\n${JSON.stringify(data.data, null, 2)}`
        });
      }
    },
    onSuccess: () => {
      setSubmitted(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate({
      form_id: form.id,
      form_name: form.name,
      data: formValues,
      status: 'Nouveau'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Formulaire introuvable</h1>
          <p className="text-gray-400">Ce formulaire n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg mx-auto px-4"
        >
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {form.success_message}
          </h1>
          <p className="text-gray-400">Nous vous contacterons bientôt.</p>
        </motion.div>
      </div>
    );
  }

  const primaryColor = form.branding?.primaryColor || '#ff006e';

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-8"
        >
          {form.branding?.logo && (
            <img src={form.branding.logo} alt="Logo" className="h-12 mb-6" />
          )}

          <h1 className="text-3xl font-bold text-white mb-3">{form.name}</h1>
          {form.description && (
            <p className="text-gray-400 mb-8">{form.description}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm text-gray-400 mb-2">
                  {field.label} {field.required && <span className="text-pink-400">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <Textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formValues[field.label] || ''}
                    onChange={(e) => setFormValues({ ...formValues, [field.label]: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white h-32"
                  />
                ) : (
                  <Input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formValues[field.label] || ''}
                    onChange={(e) => setFormValues({ ...formValues, [field.label]: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                )}
              </div>
            ))}

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-6 text-white font-semibold"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
            >
              {submitMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                'Envoyer'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}