import { supabase } from "@/integrations/supabase/client";

interface ApolloEnrichmentData {
  email: string;
  formType: 'contact' | 'newsletter' | 'booking';
  enrichmentSuccess: boolean;
  enrichedData?: Record<string, unknown>;
  errorMessage?: string;
}

export const trackApolloEnrichment = async (data: ApolloEnrichmentData): Promise<void> => {
  try {
    const eventData = {
      email: data.email,
      form_type: data.formType,
      success: data.enrichmentSuccess,
      enriched_fields: data.enrichedData || {},
      error: data.errorMessage || null,
      timestamp: new Date().toISOString(),
    };

    await supabase.from('analytics_events').insert([
      {
        event_name: 'apollo_form_enrichment',
        event_data: eventData,
      },
    ]);
  } catch (error) {
    console.warn('Failed to track Apollo enrichment:', error);
  }
};

export const checkApolloLoaded = (): boolean => {
  return !!(window as any).ApolloInbound?.formEnrichment;
};

export const logApolloStatus = (): void => {
  const isLoaded = checkApolloLoaded();
  console.log(`Apollo Inbound Status: ${isLoaded ? 'Loaded' : 'Not Loaded'}`);

  if (isLoaded) {
    console.log('Apollo form enrichment is active and ready');
  } else {
    console.warn('Apollo form enrichment is not available - forms will work without enrichment');
  }
};
