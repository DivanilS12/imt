import { openai, openaiModel } from '../config/openai.js';
import { db, FieldValue } from '../config/firebase.js';
import { collections } from '../models/collections.js';

export const chat = async (userId, message) => {
  let response;

  if (openai) {
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      messages: [
        {
          role: 'system',
          content:
            'Voce e o assistente do IMT. Oriente estudantes sobre carreiras, cursos, mercado e habilidades de forma clara e responsavel.'
        },
        { role: 'user', content: message }
      ]
    });
    response = completion.choices[0]?.message?.content || '';
  } else {
    response =
      'Integracao OpenAI pronta. Configure OPENAI_API_KEY no .env para receber respostas geradas por IA.';
  }

  const doc = await db.collection(collections.iaHistory).add({
    userId,
    message,
    response,
    createdAt: FieldValue.serverTimestamp()
  });

  return { id: doc.id, response };
};

export const getHistory = async (userId) => {
  const snapshot = await db
    .collection(collections.iaHistory)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteHistory = async (userId) => {
  const snapshot = await db.collection(collections.iaHistory).where('userId', '==', userId).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export const analyzeCurriculo = async (userId, file) => {
  const fallback = {
    habilidadesDetectadas: [],
    profissoesRecomendadas: [],
    nivelCompatibilidade: 0
  };

  if (!openai) {
    await db.collection(collections.iaHistory).add({
      userId,
      message: `Analise de curriculo: ${file?.originalname || 'arquivo nao informado'}`,
      response: JSON.stringify(fallback),
      type: 'curriculo_analysis',
      createdAt: FieldValue.serverTimestamp()
    });
    return fallback;
  }

  const completion = await openai.chat.completions.create({
    model: openaiModel,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Retorne somente JSON com habilidadesDetectadas, profissoesRecomendadas e nivelCompatibilidade. A analise recebera metadados do PDF ate que a extracao de texto seja conectada.'
      },
      {
        role: 'user',
        content: `Analise o curriculo PDF enviado: ${file?.originalname || 'sem nome'}`
      }
    ]
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || JSON.stringify(fallback));

  await db.collection(collections.iaHistory).add({
    userId,
    message: `Analise de curriculo: ${file?.originalname}`,
    response: JSON.stringify(parsed),
    type: 'curriculo_analysis',
    createdAt: FieldValue.serverTimestamp()
  });

  return parsed;
};
