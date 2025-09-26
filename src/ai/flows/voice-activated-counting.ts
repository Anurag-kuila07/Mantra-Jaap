'use server';

/**
 * @fileOverview This file defines a Genkit flow for voice-activated mantra counting.
 *
 * It uses speech recognition to count mantra repetitions, allowing users to focus on their chanting practice.
 * Exports:
 * - `countMantras`: Function to initiate voice-activated mantra counting.
 * - `VoiceActivatedCountingInput`: Input type for the `countMantras` function.
 * - `VoiceActivatedCountingOutput`: Output type for the `countMantras` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define input schema
const VoiceActivatedCountingInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A data URI containing the audio of the user chanting a mantra. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  mantra: z.string().describe('The mantra being chanted.'),
  sampleRate: z.number().describe('Sample rate of the audio data.'),
});
export type VoiceActivatedCountingInput = z.infer<
  typeof VoiceActivatedCountingInputSchema
>;

// Define output schema
const VoiceActivatedCountingOutputSchema = z.object({
  count: z.number().describe('The number of times the mantra was chanted.'),
});
export type VoiceActivatedCountingOutput = z.infer<
  typeof VoiceActivatedCountingOutputSchema
>;

// Define the flow function
export async function countMantras(
  input: VoiceActivatedCountingInput
): Promise<VoiceActivatedCountingOutput> {
  return voiceActivatedCountingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'countMantrasPrompt',
  input: {schema: VoiceActivatedCountingInputSchema},
  output: {schema: VoiceActivatedCountingOutputSchema},
  prompt: `You are an AI that counts the number of times a mantra is repeated in an audio recording.

The mantra being chanted is: {{{mantra}}}

Here is the audio recording: {{media url=audioDataUri}}

Based on the audio, determine how many times the mantra was chanted.

Return ONLY the count. Do not include any other text. Do not explain the count, or offer any other verbiage. Just the number.
`,
});

const voiceActivatedCountingFlow = ai.defineFlow(
  {
    name: 'voiceActivatedCountingFlow',
    inputSchema: VoiceActivatedCountingInputSchema,
    outputSchema: VoiceActivatedCountingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
