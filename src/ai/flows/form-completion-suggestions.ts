'use server';

/**
 * @fileOverview A flow for providing intelligent suggestions for completing document forms based on previously entered data.
 *
 * - getFormCompletionSuggestions - A function that handles the form completion suggestions process.
 * - FormCompletionSuggestionsInput - The input type for the getFormCompletionSuggestions function.
 * - FormCompletionSuggestionsOutput - The return type for the getFormCompletionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormCompletionSuggestionsInputSchema = z.object({
  documentType: z.string().describe('The type of document to complete.'),
  formData: z.record(z.any()).describe('The form data already entered by the user.'),
  previousFormData: z.array(z.record(z.any())).describe('An array of previously submitted form data for the same document type.'),
});
export type FormCompletionSuggestionsInput = z.infer<typeof FormCompletionSuggestionsInputSchema>;

const FormCompletionSuggestionsOutputSchema = z.record(z.any()).describe('Suggestions for completing the form.');
export type FormCompletionSuggestionsOutput = z.infer<typeof FormCompletionSuggestionsOutputSchema>;

export async function getFormCompletionSuggestions(input: FormCompletionSuggestionsInput): Promise<FormCompletionSuggestionsOutput> {
  return formCompletionSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formCompletionSuggestionsPrompt',
  input: {schema: FormCompletionSuggestionsInputSchema},
  output: {schema: FormCompletionSuggestionsOutputSchema},
  prompt: `You are an AI assistant specialized in providing suggestions for completing document forms.

  Given the document type, the form data already entered by the user, and an array of previously submitted form data for the same document type, your task is to provide intelligent suggestions for completing the form.

  Document Type: {{{documentType}}}
  Current Form Data: {{{formData}}}
  Previous Form Data: {{{previousFormData}}}

  Provide the suggestions in JSON format.
  `,
});

const formCompletionSuggestionsFlow = ai.defineFlow(
  {
    name: 'formCompletionSuggestionsFlow',
    inputSchema: FormCompletionSuggestionsInputSchema,
    outputSchema: FormCompletionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
